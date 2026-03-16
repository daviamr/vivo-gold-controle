import { Customer } from "@/interface/Customer";
import { api } from "./api"

export class VivoFibraAPI {
  async createOrder(data: Customer): Promise<any> {
    const payload = this.orderPayload(data)
    console.log('>>> payload', payload)
    const response = await api.post('pedido-telefonia-movel',
      payload, { headers: { 'Content-Type': 'application/json' } })

    console.log('>>> response', response.data)
    return response.data
  }

  async verifyTel(ddi: string) {
    if (!this.onlyNumber(ddi).startsWith('55')) return true;

    const payload = {
      telefone: this.onlyNumber(ddi)
    }
    const response = await api.post('verificar-telefone',
      payload, { headers: { 'Content-Type': 'application/json' } })

    console.log('>>> response verifyTel', response.data)
    return response.data.numero_valido
  }

  async verifyEmail(email: string) {
    const payload = {
      email: email
    }
    const response = await api.post('verificar-email',
      payload, { headers: { 'Content-Type': 'application/json' } })

    console.log('>>> response verifyEmail', response.data)
    return response.data.email_status
  }

  async getPlans() {
    try {
      const response = await api.get('/planos/telefonia-movel')
      console.log('>>> response', response.data)
      return response.data
    } catch (error) {
      console.log(error)
    }
  }

  orderPayload(data: Customer) {
    const { firstStepData, address: secondStepData, thirdStepData, fourthStepData, plan } = data
    const fingerprint = this.getFingerprint()
    return {
      "pedido": {
        "cep": secondStepData?.cep,
        "addressnumber": secondStepData?.homeNumber,
        ...(secondStepData?.cnpj && { "cnpj": secondStepData?.cnpj }),
        ...(firstStepData?.companyName && { "razaosocial": firstStepData?.companyName }),
        ...(secondStepData?.block && { "addressblock": secondStepData?.block }),
        ...(secondStepData?.lot && { "addresslot": secondStepData?.lot }),
        "address": secondStepData?.street,
        "district": secondStepData?.district,
        "city": secondStepData?.city,
        "state": secondStepData?.uf,
        "buildingorhouse": secondStepData?.liveIn === 'house' ? 2 : 1,
        "addresscomplement": secondStepData?.complemento,
        "addressreferencepoint":
          (secondStepData?.landmark ? secondStepData?.landmark :
            secondStepData?.floor ? secondStepData?.floor : ''),
        "typeclient": 'pf',
        "fullname": firstStepData?.fullName,
        "phone": this.onlyNumber(firstStepData?.tel ?? ''),
        "email": firstStepData?.email,
        "cpf": fourthStepData?.cpf,
        "birthdate": fourthStepData?.bornDate?.split(/[\/\-]/).reverse().join('-'),
        "motherfullname": fourthStepData?.motherName ?? '',
        "dueday": thirdStepData?.dueDay,
        "installation_preferred_date_one": thirdStepData?.primaryDate ?? '',
        "installation_preferred_date_two": thirdStepData?.secondaryDate ?? '',
        "terms_accepted": fourthStepData?.termsOfUse,
        "accept_offers": fourthStepData?.acceptOffers,
        "url": fourthStepData?.url,
        ...(fingerprint && { ...fingerprint }),
        "client_ip": '123.456.789',
        "line_action": 'port_in_to_vivo',
        "line_number_informed": firstStepData?.mobileLineNumber,
        "wants_esim": firstStepData?.eSim,
        "planId": plan.id,
        "extras": plan.extras
          .filter(e => e.checked === true)
          .map(e => ({ id: e.id, value: e.checked }))
      }
    }
  }

  getFingerprint() {
    const ua = navigator.userAgent;

    // OS
    const getOS = () => {
      if (/android/i.test(ua)) {
        const version = ua.match(/Android\s([0-9.]+)/)?.[1] + '.0';
        return { name: 'Android', version };
      }
      if (/iphone|ipad/i.test(ua)) {
        const version = ua.match(/OS\s([0-9_]+)/)?.[1].replace(/_/g, '.');
        return { name: 'iOS', version };
      }
      if (/windows/i.test(ua)) return { name: 'Windows', version: '10.0.0' };
      if (/mac/i.test(ua)) return { name: 'MacOS', version: '10.0.0' };
      if (/linux/i.test(ua)) return { name: 'Linux', version: '0.0.0' };
      return { name: 'Unknown', version: '0.0.0' };
    };

    // Device
    const getDevice = () => {
      if (/mobile/i.test(ua)) return 'mobile';
      if (/tablet/i.test(ua)) return 'tablet';
      return 'desktop';
    };

    // Browser
    const getBrowser = () => {
      const browsers = [
        { name: 'Chrome', regex: /Chrome\/([0-9.]+)/ },
        { name: 'Firefox', regex: /Firefox\/([0-9.]+)/ },
        { name: 'Safari', regex: /Version\/([0-9.]+).*Safari/ },
        { name: 'Edge', regex: /Edg\/([0-9.]+)/ },
      ];
      for (const b of browsers) {
        const match = ua.match(b.regex);
        if (match) return { name: b.name, version: match[1] };
      }
      // fallback — pega o que vier no UA (ex: "Not(A:Brand")
      const fallback = ua.match(/([A-Za-z]+)\/([0-9.]+)/);
      return fallback
        ? { name: fallback[1], version: fallback[2] }
        : { name: 'Unknown', version: '0.0.0' };
    };

    // Timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const timezoneOffset = new Date().getTimezoneOffset(); // ex: 180 para GMT-3

    // Resolution
    const resolution = {
      dpr: window.devicePixelRatio,
      width: window.screen.width,
      height: window.screen.height,
    };

    return {
      finger_print: {
        os: getOS(),
        device: getDevice(),
        browser: getBrowser(),
        timezone: `GMT${timezoneOffset > 0 ? '-' : '+'}${Math.abs(timezoneOffset / 60)}`,
        resolution,
        timezone_offset: timezoneOffset,
      }
    };
  }

  onlyNumber(value: string): string {
    return value.replace(/\D/g, '');
  }
}
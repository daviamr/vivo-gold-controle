import blocks from "@/content/terms-of-use.raw.json"

type ParagraphBlock = { type: "p"; text: string }
type TableBlock = { type: "table"; rows: string[][] }
type Block = ParagraphBlock | TableBlock

type ParagraphVariant =
  | "main-section"
  | "sub-section"
  | "sub-sub-section"
  | "sub-sub-sub-section"
  | "definition"
  | "footer-date"
  | "body"

type RenderUnit =
  | { kind: "paragraph"; text: string; variant: ParagraphVariant }
  | { kind: "list"; items: string[] }

function classifyParagraph(text: string): ParagraphVariant {
  if (/^Atualiza(ção|do em) /.test(text)) return "footer-date"
  if (/^\d+\.\d+\.\d+\.\d+\./.test(text)) return "sub-sub-sub-section"
  if (/^\d+\.\d+\.\d+\./.test(text)) return "sub-sub-section"
  if (/^\d+\.\d+\./.test(text)) return "sub-section"
  if (/^\d+\.\s(?!\d)/.test(text)) return "main-section"
  if (/^[A-ZÀ-Ú][^:]{0,45}:\s/.test(text) && !/^\d/.test(text)) return "definition"
  return "body"
}

function isListItem(text: string): boolean {
  return (
    text.endsWith(";") ||
    /^\([ivx]+\)\s/.test(text) ||
    /^[a-e]\.\s/.test(text)
  )
}

function buildRenderUnits(content: Block[]): RenderUnit[] {
  const units: RenderUnit[] = []
  let index = 0

  while (index < content.length) {
    const block = content[index]

    if (block.type === "table") {
      index += 1
      continue
    }

    if (isListItem(block.text)) {
      const items: string[] = []
      while (index < content.length) {
        const current = content[index]
        if (current.type !== "p" || !isListItem(current.text)) break
        items.push(current.text)
        index += 1
      }
      units.push({ kind: "list", items })
      continue
    }

    units.push({
      kind: "paragraph",
      text: block.text,
      variant: classifyParagraph(block.text),
    })
    index += 1
  }

  return units
}

function paragraphClassName(variant: ParagraphVariant) {
  switch (variant) {
    case "main-section":
      return "mt-8 mb-3 text-lg font-bold text-[#333333] first:mt-0"
    case "sub-section":
      return "mt-5 mb-2 text-base font-semibold text-[#333333]"
    case "sub-sub-section":
      return "mt-4 mb-2 text-sm font-semibold text-[#333333] sm:text-base"
    case "sub-sub-sub-section":
      return "mt-3 mb-2 text-sm font-semibold text-[#333333] sm:text-base"
    case "definition":
      return "mb-2 ml-4 text-sm leading-relaxed text-[#333333] sm:text-base"
    case "footer-date":
      return "mt-10 text-sm font-semibold text-[#747474]"
    default:
      return "mb-3 text-sm leading-relaxed text-[#333333] sm:text-base"
  }
}

export default function TermsOfUseBody() {
  const content = blocks as Block[]
  const units = buildRenderUnits(content.slice(1)).filter(
    (unit) => !(unit.kind === "paragraph" && unit.variant === "footer-date"),
  )

  return (
    <div className="mt-10 space-y-1">
      {units.map((unit, index) => {
        if (unit.kind === "list") {
          return (
            <ul key={index} className="mb-4 ml-5 list-disc space-y-2 text-sm text-[#333333] sm:text-base">
              {unit.items.map((item, itemIndex) => (
                <li key={itemIndex} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          )
        }

        return (
          <p key={index} className={paragraphClassName(unit.variant)}>
            {unit.text}
          </p>
        )
      })}
    </div>
  )
}

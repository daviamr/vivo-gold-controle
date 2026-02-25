import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

function Index({icon, title, desc}: AccordionProps) {
  return (
    <Accordion type="single" collapsible className="border-b">
      <AccordionItem value="item-1">
        <AccordionTrigger>{title}</AccordionTrigger>
        <AccordionContent>
          {desc}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

type AccordionProps = {
  icon?: any,
  title: string,
  desc: string
}

export default Index
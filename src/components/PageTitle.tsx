import { Helmet } from 'react-helmet-async'

interface PageTitleProps {
  title: string
  description?: string
}

export function PageTitle({ title, description }: PageTitleProps) {
  return (
    <Helmet>
      <title>{title} | Romay</title>
      {description && <meta name="description" content={description} />}
    </Helmet>
  )
}

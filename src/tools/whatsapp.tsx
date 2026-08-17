import { useState } from 'react';
import { CopyButton, ResultBox, Field } from '../tool-ui';
import { useT, type Language } from '../i18n';
import type { Tool } from '../catalog';

const S = {
  en: {
    customerName: 'Customer name',
    templateTitle: 'Template title',
    bodyTextHint: 'Body text (use {{name}} for personalization)',
    buttonLabel: 'Button label',
    buttonUrl: 'Button URL',
    preview: 'Preview',
    copyJson: 'Copy JSON',
    qrPlaceholder: 'Type a quick reply…',
    add: 'Add',
    phoneNumberCountry: 'Phone number (with country code, no +)',
    preFilledMessage: 'Pre-filled message',
    yourWhatsappLink: 'Your WhatsApp link',
    copyLink: 'Copy link',
    openInWhatsapp: 'Open in WhatsApp',
    phoneNumber: 'Phone number',
    preFilledMessageOptional: 'Pre-filled message (optional)',
    downloadQr: 'Download QR',
    whatsappQr: 'WhatsApp QR',
    broadcastMessage: 'Broadcast message',
    recipientsHint: 'Recipients (one phone per line)',
    sendTo: 'Send to',
    productName: 'Product name',
    discountPct: 'Discount %',
    promoCode: 'Promo code',
    expiry: 'Expiry',
    copyMessage: 'Copy message',
    shareOnWhatsapp: 'Share on WhatsApp',
    promoMsg: '🎉 *{discount}% OFF* {product}!\n\nUse code *{code}* at checkout.\nHurry — offer ends {expiry}!\n\nShop now: https://yourstore.com',
    businessName: 'Business name',
    businessHours: 'Business hours',
    customGreetingLine: 'Custom greeting line',
    copy: 'Copy',
    share: 'Share',
    greetingMsg: '👋 Hello and welcome to *{business}*!\n\n{msg}\n\n📅 Our hours: {hours}\n\nHow can we help you today?',
    phone: 'Phone',
    followUpNote: 'Follow-up note',
    date: 'Date',
    addReminder: 'Add reminder',
    send: 'Send',
    noReminders: 'No reminders yet. Add one above.',
    reminderLinkMsg: 'Hi {name}, {note}',
    service: 'Service',
    time: 'Time',
    appointmentMsg: '📅 *Appointment Confirmation*\n\nName: {name}\nService: {service}\nDate: {date}\nTime: {time}\n\nWe look forward to seeing you! Reply to confirm or reschedule.',
    sendViaWhatsapp: 'Send via WhatsApp',
    storePhone: 'Store phone',
    deliveryAddress: 'Delivery address',
    item: 'Item',
    qty: 'Qty',
    price: 'Price',
    remove: 'Remove',
    addItem: '+ Add item',
    total: 'Total: ${total}',
    orderMsg: '🛒 *New Order*\n\nCustomer: {customer}\nAddress: {addr}\n\n{items}\n\n*Total: ${total}*',
    orderItemLine: '{i}. {name} × {qty} = ${amount}',
    copyOrder: 'Copy order',
    sendOrder: 'Send order',
    yourWhatsappNumber: 'Your WhatsApp number',
    name: 'Name',
    addProduct: '+ Add product',
    description: 'Description',
    copyCatalog: 'Copy catalog',
    catalogMsg: '🛍️ *Our Products*\n\n{products}\n\nTo order, reply with the item number!',
    catalogProductLine: '{i}. *{name}* — ${price}\n   {desc}',
    email: 'Email',
    notes: 'Notes',
    saveCustomer: 'Save customer',
    message: 'Message',
    noCustomers: 'No customers saved yet.',
    surveyTopic: 'Survey topic',
    questionsHint: 'Questions (one per line)',
    sendToLabel: 'Send to',
    surveyMsg: '📋 *Quick Survey*\n\n{topic}\n\n{questions}\n\nPlease reply with your answers. Thank you!',
    sendSurvey: 'Send survey',
    yourName: 'Your name',
    sendToBusiness: 'Send to (business)',
    ratingLabel: 'Rating: {rating}/5',
    yourFeedback: 'Your feedback',
    feedbackMsg: '💬 *Feedback Received*\n\nFrom: {name}\nRating: {stars} ({rating}/5)\n\n"{feedback}"',
    sendFeedback: 'Send feedback',
  },
  pt: {
    customerName: 'Nome do cliente',
    templateTitle: 'Título do modelo',
    bodyTextHint: 'Texto do corpo (use {{name}} para personalização)',
    buttonLabel: 'Texto do botão',
    buttonUrl: 'URL do botão',
    preview: 'Pré-visualização',
    copyJson: 'Copiar JSON',
    qrPlaceholder: 'Digite uma resposta rápida…',
    add: 'Adicionar',
    phoneNumberCountry: 'Número de telefone (com código do país, sem +)',
    preFilledMessage: 'Mensagem predefinida',
    yourWhatsappLink: 'Seu link do WhatsApp',
    copyLink: 'Copiar link',
    openInWhatsapp: 'Abrir no WhatsApp',
    phoneNumber: 'Número de telefone',
    preFilledMessageOptional: 'Mensagem predefinida (opcional)',
    downloadQr: 'Baixar QR',
    whatsappQr: 'QR do WhatsApp',
    broadcastMessage: 'Mensagem de transmissão',
    recipientsHint: 'Destinatários (um telefone por linha)',
    sendTo: 'Enviar para',
    productName: 'Nome do produto',
    discountPct: 'Desconto %',
    promoCode: 'Código promocional',
    expiry: 'Validade',
    copyMessage: 'Copiar mensagem',
    shareOnWhatsapp: 'Compartilhar no WhatsApp',
    promoMsg: '🎉 *{discount}% OFF* {product}!\n\nUse o código *{code}* no checkout.\nCorra — a oferta acaba em {expiry}!\n\nCompre agora: https://yourstore.com',
    businessName: 'Nome da empresa',
    businessHours: 'Horário de funcionamento',
    customGreetingLine: 'Linha de saudação personalizada',
    copy: 'Copiar',
    share: 'Compartilhar',
    greetingMsg: '👋 Olá e bem-vindo(a) à *{business}*!\n\n{msg}\n\n📅 Nosso horário: {hours}\n\nComo podemos ajudar você hoje?',
    phone: 'Telefone',
    followUpNote: 'Nota de acompanhamento',
    date: 'Data',
    addReminder: 'Adicionar lembrete',
    send: 'Enviar',
    noReminders: 'Nenhum lembrete ainda. Adicione um acima.',
    reminderLinkMsg: 'Oi {name}, {note}',
    service: 'Serviço',
    time: 'Hora',
    appointmentMsg: '📅 *Confirmação de Agendamento*\n\nNome: {name}\nServiço: {service}\nData: {date}\nHora: {time}\n\nEsperamos por você! Responda para confirmar ou reagendar.',
    sendViaWhatsapp: 'Enviar pelo WhatsApp',
    storePhone: 'Telefone da loja',
    deliveryAddress: 'Endereço de entrega',
    item: 'Item',
    qty: 'Qtd',
    price: 'Preço',
    remove: 'Remover',
    addItem: '+ Adicionar item',
    total: 'Total: R$ {total}',
    orderMsg: '🛒 *Novo Pedido*\n\nCliente: {customer}\nEndereço: {addr}\n\n{items}\n\n*Total: R$ {total}*',
    orderItemLine: '{i}. {name} × {qty} = R$ {amount}',
    copyOrder: 'Copiar pedido',
    sendOrder: 'Enviar pedido',
    yourWhatsappNumber: 'Seu número do WhatsApp',
    name: 'Nome',
    addProduct: '+ Adicionar produto',
    description: 'Descrição',
    copyCatalog: 'Copiar catálogo',
    catalogMsg: '🛍️ *Nossos Produtos*\n\n{products}\n\nPara pedir, responda com o número do item!',
    catalogProductLine: '{i}. *{name}* — R$ {price}\n   {desc}',
    email: 'E-mail',
    notes: 'Notas',
    saveCustomer: 'Salvar cliente',
    message: 'Mensagem',
    noCustomers: 'Nenhum cliente salvo ainda.',
    surveyTopic: 'Tema da pesquisa',
    questionsHint: 'Perguntas (uma por linha)',
    sendToLabel: 'Enviar para',
    surveyMsg: '📋 *Pesquisa Rápida*\n\n{topic}\n\n{questions}\n\nPor favor, responda com suas respostas. Obrigado!',
    sendSurvey: 'Enviar pesquisa',
    yourName: 'Seu nome',
    sendToBusiness: 'Enviar para (empresa)',
    ratingLabel: 'Avaliação: {rating}/5',
    yourFeedback: 'Seu feedback',
    feedbackMsg: '💬 *Feedback Recebido*\n\nDe: {name}\nAvaliação: {stars} ({rating}/5)\n\n"{feedback}"',
    sendFeedback: 'Enviar feedback',
  },
  es: {
    customerName: 'Nombre del cliente',
    templateTitle: 'Título de la plantilla',
    bodyTextHint: 'Texto del cuerpo (usa {{name}} para personalizar)',
    buttonLabel: 'Texto del botón',
    buttonUrl: 'URL del botón',
    preview: 'Vista previa',
    copyJson: 'Copiar JSON',
    qrPlaceholder: 'Escribe una respuesta rápida…',
    add: 'Añadir',
    phoneNumberCountry: 'Número de teléfono (con código de país, sin +)',
    preFilledMessage: 'Mensaje predefinido',
    yourWhatsappLink: 'Tu enlace de WhatsApp',
    copyLink: 'Copiar enlace',
    openInWhatsapp: 'Abrir en WhatsApp',
    phoneNumber: 'Número de teléfono',
    preFilledMessageOptional: 'Mensaje predefinido (opcional)',
    downloadQr: 'Descargar QR',
    whatsappQr: 'QR de WhatsApp',
    broadcastMessage: 'Mensaje de difusión',
    recipientsHint: 'Destinatarios (un teléfono por línea)',
    sendTo: 'Enviar a',
    productName: 'Nombre del producto',
    discountPct: 'Descuento %',
    promoCode: 'Código promocional',
    expiry: 'Vencimiento',
    copyMessage: 'Copiar mensaje',
    shareOnWhatsapp: 'Compartir en WhatsApp',
    promoMsg: '🎉 *{discount}% OFF* {product}!\n\nUsa el código *{code}* al pagar.\n¡Date prisa — la oferta termina {expiry}!\n\nCompra ahora: https://yourstore.com',
    businessName: 'Nombre del negocio',
    businessHours: 'Horario de atención',
    customGreetingLine: 'Línea de saludo personalizada',
    copy: 'Copiar',
    share: 'Compartir',
    greetingMsg: '👋 ¡Hola y bienvenido a *{business}*!\n\n{msg}\n\n📅 Nuestro horario: {hours}\n\n¿Cómo podemos ayudarte hoy?',
    phone: 'Teléfono',
    followUpNote: 'Nota de seguimiento',
    date: 'Fecha',
    addReminder: 'Añadir recordatorio',
    send: 'Enviar',
    noReminders: 'Aún no hay recordatorios. Añade uno arriba.',
    reminderLinkMsg: 'Hola {name}, {note}',
    service: 'Servicio',
    time: 'Hora',
    appointmentMsg: '📅 *Confirmación de Cita*\n\nNombre: {name}\nServicio: {service}\nFecha: {date}\nHora: {time}\n\n¡Esperamos verte! Responde para confirmar o reprogramar.',
    sendViaWhatsapp: 'Enviar por WhatsApp',
    storePhone: 'Teléfono de la tienda',
    deliveryAddress: 'Dirección de entrega',
    item: 'Artículo',
    qty: 'Cant',
    price: 'Precio',
    remove: 'Eliminar',
    addItem: '+ Añadir artículo',
    total: 'Total: ${total}',
    orderMsg: '🛒 *Nuevo Pedido*\n\nCliente: {customer}\nDirección: {addr}\n\n{items}\n\n*Total: ${total}*',
    orderItemLine: '{i}. {name} × {qty} = ${amount}',
    copyOrder: 'Copiar pedido',
    sendOrder: 'Enviar pedido',
    yourWhatsappNumber: 'Tu número de WhatsApp',
    name: 'Nombre',
    addProduct: '+ Añadir producto',
    description: 'Descripción',
    copyCatalog: 'Copiar catálogo',
    catalogMsg: '🛍️ *Nuestros Productos*\n\n{products}\n\nPara pedir, responde con el número del artículo!',
    catalogProductLine: '{i}. *{name}* — ${price}\n   {desc}',
    email: 'Correo',
    notes: 'Notas',
    saveCustomer: 'Guardar cliente',
    message: 'Mensaje',
    noCustomers: 'Aún no hay clientes guardados.',
    surveyTopic: 'Tema de la encuesta',
    questionsHint: 'Preguntas (una por línea)',
    sendToLabel: 'Enviar a',
    surveyMsg: '📋 *Encuesta Rápida*\n\n{topic}\n\n{questions}\n\nPor favor, responde con tus respuestas. ¡Gracias!',
    sendSurvey: 'Enviar encuesta',
    yourName: 'Tu nombre',
    sendToBusiness: 'Enviar a (empresa)',
    ratingLabel: 'Valoración: {rating}/5',
    yourFeedback: 'Tu comentario',
    feedbackMsg: '💬 *Comentario Recibido*\n\nDe: {name}\nValoración: {stars} ({rating}/5)\n\n"{feedback}"',
    sendFeedback: 'Enviar comentario',
  },
  de: {
    customerName: 'Kundenname',
    templateTitle: 'Vorlagentitel',
    bodyTextHint: 'Textkörper ({{name}} für Personalisierung verwenden)',
    buttonLabel: 'Schaltflächenbeschriftung',
    buttonUrl: 'Schaltflächen-URL',
    preview: 'Vorschau',
    copyJson: 'JSON kopieren',
    qrPlaceholder: 'Schnellantwort eingeben…',
    add: 'Hinzufügen',
    phoneNumberCountry: 'Telefonnummer (mit Ländervorwahl, ohne +)',
    preFilledMessage: 'Vorausgefüllte Nachricht',
    yourWhatsappLink: 'Dein WhatsApp-Link',
    copyLink: 'Link kopieren',
    openInWhatsapp: 'In WhatsApp öffnen',
    phoneNumber: 'Telefonnummer',
    preFilledMessageOptional: 'Vorausgefüllte Nachricht (optional)',
    downloadQr: 'QR herunterladen',
    whatsappQr: 'WhatsApp-QR',
    broadcastMessage: 'Rundsendungsnachricht',
    recipientsHint: 'Empfänger (eine Telefonnummer pro Zeile)',
    sendTo: 'Senden an',
    productName: 'Produktname',
    discountPct: 'Rabatt %',
    promoCode: 'Promo-Code',
    expiry: 'Ablauf',
    copyMessage: 'Nachricht kopieren',
    shareOnWhatsapp: 'Auf WhatsApp teilen',
    promoMsg: '🎉 *{discount}% RABATT* {product}!\n\nCode *{code}* an der Kasse verwenden.\nBeeil dich — Angebot endet {expiry}!\n\nJetzt einkaufen: https://yourstore.com',
    businessName: 'Unternehmensname',
    businessHours: 'Geschäftszeiten',
    customGreetingLine: 'Benutzerdefinierte Begrüßungszeile',
    copy: 'Kopieren',
    share: 'Teilen',
    greetingMsg: '👋 Hallo und willkommen bei *{business}*!\n\n{msg}\n\n📅 Unsere Zeiten: {hours}\n\nWie können wir dir heute helfen?',
    phone: 'Telefon',
    followUpNote: 'Follow-up-Notiz',
    date: 'Datum',
    addReminder: 'Erinnerung hinzufügen',
    send: 'Senden',
    noReminders: 'Noch keine Erinnerungen. Füge oben eine hinzu.',
    reminderLinkMsg: 'Hallo {name}, {note}',
    service: 'Service',
    time: 'Uhrzeit',
    appointmentMsg: '📅 *Terminbestätigung*\n\nName: {name}\nService: {service}\nDatum: {date}\nUhrzeit: {time}\n\nWir freuen uns auf dich! Antworte zum Bestätigen oder Verschieben.',
    sendViaWhatsapp: 'Per WhatsApp senden',
    storePhone: 'Telefon des Geschäfts',
    deliveryAddress: 'Lieferadresse',
    item: 'Artikel',
    qty: 'Menge',
    price: 'Preis',
    remove: 'Entfernen',
    addItem: '+ Artikel hinzufügen',
    total: 'Gesamt: ${total}',
    orderMsg: '🛒 *Neue Bestellung*\n\nKunde: {customer}\nAdresse: {addr}\n\n{items}\n\n*Gesamt: ${total}*',
    orderItemLine: '{i}. {name} × {qty} = ${amount}',
    copyOrder: 'Bestellung kopieren',
    sendOrder: 'Bestellung senden',
    yourWhatsappNumber: 'Deine WhatsApp-Nummer',
    name: 'Name',
    addProduct: '+ Produkt hinzufügen',
    description: 'Beschreibung',
    copyCatalog: 'Katalog kopieren',
    catalogMsg: '🛍️ *Unsere Produkte*\n\n{products}\n\nZum Bestellen antworte mit der Artikelnummer!',
    catalogProductLine: '{i}. *{name}* — ${price}\n   {desc}',
    email: 'E-Mail',
    notes: 'Notizen',
    saveCustomer: 'Kunde speichern',
    message: 'Nachricht',
    noCustomers: 'Noch keine Kunden gespeichert.',
    surveyTopic: 'Umfragethema',
    questionsHint: 'Fragen (eine pro Zeile)',
    sendToLabel: 'Senden an',
    surveyMsg: '📋 *Kurze Umfrage*\n\n{topic}\n\n{questions}\n\nBitte antworte mit deinen Antworten. Danke!',
    sendSurvey: 'Umfrage senden',
    yourName: 'Dein Name',
    sendToBusiness: 'Senden an (Unternehmen)',
    ratingLabel: 'Bewertung: {rating}/5',
    yourFeedback: 'Dein Feedback',
    feedbackMsg: '💬 *Feedback erhalten*\n\nVon: {name}\nBewertung: {stars} ({rating}/5)\n\n"{feedback}"',
    sendFeedback: 'Feedback senden',
  },
} satisfies Record<Language, Record<string, string>>;

export function WaMessageTemplate(_: { tool: Tool }) {
  const t = useT(S);
  const [name, setName] = useState('John');
  const [title, setTitle] = useState('Order Confirmation');
  const [body, setBody] = useState('Hi {{name}}, your order #12345 has been confirmed and will ship within 2 business days.');
  const [cta, setCta] = useState('Track Order');
  const [url, setUrl] = useState('https://example.com/track');

  const filled = body.replace(/\{\{name\}\}/g, name);
  const template = { name: title.toLowerCase().replace(/\s+/g, '_'), language: 'en_US', components: [
    { type: 'header', parameters: [{ type: 'text', text: title }] },
    { type: 'body', parameters: [{ type: 'text', text: name }] },
    { type: 'button', sub_type: 'url', parameters: [{ type: 'text', text: url }] },
  ]};

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label={t.customerName}><input className="input" value={name} onChange={(e) => setName(e.target.value)} /></Field>
        <Field label={t.templateTitle}><input className="input" value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
      </div>
      <Field label={t.bodyTextHint}><textarea className="input min-h-[100px]" value={body} onChange={(e) => setBody(e.target.value)} /></Field>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label={t.buttonLabel}><input className="input" value={cta} onChange={(e) => setCta(e.target.value)} /></Field>
        <Field label={t.buttonUrl}><input className="input" value={url} onChange={(e) => setUrl(e.target.value)} /></Field>
      </div>
      <div className="rounded-2xl bg-accent-50 p-5 ring-1 ring-accent-100">
        <p className="text-xs uppercase tracking-wider text-accent-700 mb-2">{t.preview}</p>
        <p className="font-semibold text-slate-800">{title}</p>
        <p className="mt-1 text-sm text-slate-700">{filled}</p>
        <p className="mt-2 text-sm text-accent-700 font-medium">🔗 {cta}</p>
      </div>
      <ResultBox><pre className="overflow-x-auto text-xs font-mono text-slate-800">{JSON.stringify(template, null, 2)}</pre></ResultBox>
      <div className="flex justify-end"><CopyButton text={JSON.stringify(template, null, 2)} label={t.copyJson} /></div>
    </div>
  );
}

export function WaQuickReply(_: { tool: Tool }) {
  const t = useT(S);
  const [replies, setReplies] = useState<string[]>(['Thanks for reaching out! How can I help?', 'Sure, let me check that for you.', 'Your order is on the way!']);
  const [input, setInput] = useState('');

  const add = () => { if (input.trim()) { setReplies([...replies, input.trim()]); setInput(''); } };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input className="input" value={input} placeholder={t.qrPlaceholder} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} />
        <button onClick={add} className="btn-primary shrink-0">{t.add}</button>
      </div>
      <div className="space-y-2">
        {replies.map((r, i) => (
          <div key={i} className="flex items-center gap-2 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
            <span className="flex-1 text-sm text-slate-700">{r}</span>
            <CopyButton text={r} label="" />
            <button onClick={() => setReplies((p) => p.filter((_, idx) => idx !== i))} className="text-slate-400 hover:text-rose-500 text-sm">✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function WaLinkGenerator(_: { tool: Tool }) {
  const t = useT(S);
  const [phone, setPhone] = useState('15551234567');
  const [msg, setMsg] = useState('Hello! I have a question about your product.');
  const link = `https://wa.me/${phone.replace(/[^0-9]/g, '')}${msg ? `?text=${encodeURIComponent(msg)}` : ''}`;

  return (
    <div className="space-y-4">
      <Field label={t.phoneNumberCountry}><input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="15551234567" /></Field>
      <Field label={t.preFilledMessage}><textarea className="input min-h-[80px]" value={msg} onChange={(e) => setMsg(e.target.value)} /></Field>
      <div className="rounded-2xl bg-accent-50 p-5 text-center ring-1 ring-accent-100">
        <p className="text-xs uppercase tracking-wider text-accent-700 mb-2">{t.yourWhatsappLink}</p>
        <p className="font-mono text-sm text-slate-800 break-all">{link}</p>
      </div>
      <div className="flex justify-center gap-2">
        <CopyButton text={link} label={t.copyLink} />
        <a href={link} target="_blank" rel="noreferrer" className="btn-primary">{t.openInWhatsapp}</a>
      </div>
    </div>
  );
}

export function WaQrCode(_: { tool: Tool }) {
  const t = useT(S);
  const [phone, setPhone] = useState('15551234567');
  const [msg, setMsg] = useState('');
  const link = `https://wa.me/${phone.replace(/[^0-9]/g, '')}${msg ? `?text=${encodeURIComponent(msg)}` : ''}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(link)}`;

  return (
    <div className="space-y-4">
      <Field label={t.phoneNumber}><input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} /></Field>
      <Field label={t.preFilledMessageOptional}><input className="input" value={msg} onChange={(e) => setMsg(e.target.value)} /></Field>
      <div className="flex flex-col items-center gap-3">
        <img src={qrUrl} alt={t.whatsappQr} className="rounded-xl ring-1 ring-slate-200" />
        <a href={qrUrl} download="whatsapp-qr.png" className="btn-primary">{t.downloadQr}</a>
      </div>
    </div>
  );
}

export function WaBroadcast(_: { tool: Tool }) {
  const t = useT(S);
  const [msg, setMsg] = useState('🎉 Special offer! 20% off all items this weekend only.');
  const [recipients, setRecipients] = useState('15551234567\n15557654321\n15559998888');

  const phones = recipients.split('\n').filter(Boolean);
  const links = phones.map((p) => `https://wa.me/${p.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`);

  return (
    <div className="space-y-4">
      <Field label={t.broadcastMessage}><textarea className="input min-h-[80px]" value={msg} onChange={(e) => setMsg(e.target.value)} /></Field>
      <Field label={t.recipientsHint}><textarea className="input min-h-[100px] font-mono text-sm" value={recipients} onChange={(e) => setRecipients(e.target.value)} /></Field>
      <ResultBox>
        <div className="space-y-2">
          {links.map((l, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-xs text-slate-500">#{i + 1}</span>
              <a href={l} target="_blank" rel="noreferrer" className="text-sm text-brand-600 hover:underline flex-1 truncate">{t.sendTo} {phones[i]}</a>
              <CopyButton text={l} label="" />
            </div>
          ))}
        </div>
      </ResultBox>
    </div>
  );
}

export function WaPromoMessage(_: { tool: Tool }) {
  const t = useT(S);
  const [product, setProduct] = useState('Premium Headphones');
  const [discount, setDiscount] = useState(25);
  const [code, setCode] = useState('SAVE25');
  const [expiry, setExpiry] = useState('Sunday midnight');

  const msg = t.promoMsg
    .replace('{discount}', String(discount))
    .replace('{product}', product)
    .replace('{code}', code)
    .replace('{expiry}', expiry);

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label={t.productName}><input className="input" value={product} onChange={(e) => setProduct(e.target.value)} /></Field>
        <Field label={t.discountPct}><input type="number" className="input" value={discount} onChange={(e) => setDiscount(+e.target.value || 0)} /></Field>
        <Field label={t.promoCode}><input className="input" value={code} onChange={(e) => setCode(e.target.value)} /></Field>
        <Field label={t.expiry}><input className="input" value={expiry} onChange={(e) => setExpiry(e.target.value)} /></Field>
      </div>
      <div className="rounded-2xl bg-slate-900 p-5 text-accent-300 font-mono text-sm whitespace-pre-wrap">{msg}</div>
      <div className="flex justify-end gap-2">
        <CopyButton text={msg} label={t.copyMessage} />
        <a href={`https://wa.me/?text=${encodeURIComponent(msg)}`} target="_blank" rel="noreferrer" className="btn-primary">{t.shareOnWhatsapp}</a>
      </div>
    </div>
  );
}

export function WaGreetingMessage(_: { tool: Tool }) {
  const t = useT(S);
  const [business, setBusiness] = useState('Go LANA Store');
  const [hours, setHours] = useState('Mon–Fri, 9am–6pm');
  const [msg, setMsg] = useState('Welcome! Thanks for reaching out. We typically reply within an hour.');

  const greeting = t.greetingMsg
    .replace('{business}', business)
    .replace('{msg}', msg)
    .replace('{hours}', hours);

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label={t.businessName}><input className="input" value={business} onChange={(e) => setBusiness(e.target.value)} /></Field>
        <Field label={t.businessHours}><input className="input" value={hours} onChange={(e) => setHours(e.target.value)} /></Field>
      </div>
      <Field label={t.customGreetingLine}><input className="input" value={msg} onChange={(e) => setMsg(e.target.value)} /></Field>
      <div className="rounded-2xl bg-slate-900 p-5 text-accent-300 font-mono text-sm whitespace-pre-wrap">{greeting}</div>
      <div className="flex justify-end gap-2">
        <CopyButton text={greeting} label={t.copy} />
        <a href={`https://wa.me/?text=${encodeURIComponent(greeting)}`} target="_blank" rel="noreferrer" className="btn-primary">{t.share}</a>
      </div>
    </div>
  );
}

export function WaFollowUpReminder(_: { tool: Tool }) {
  const t = useT(S);
  const [reminders, setReminders] = useState<{ id: string; name: string; phone: string; note: string; date: string }[]>(() => {
    try { return JSON.parse(localStorage.getItem('wa-reminders') || '[]'); } catch { return []; }
  });
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState('');

  const add = () => {
    if (!name || !phone) return;
    const nr = { id: Math.random().toString(36).slice(2), name, phone, note, date };
    const next = [nr, ...reminders];
    setReminders(next); localStorage.setItem('wa-reminders', JSON.stringify(next));
    setName(''); setPhone(''); setNote(''); setDate('');
  };
  const del = (id: string) => { const next = reminders.filter((r) => r.id !== id); setReminders(next); localStorage.setItem('wa-reminders', JSON.stringify(next)); };

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label={t.customerName}><input className="input" value={name} onChange={(e) => setName(e.target.value)} /></Field>
        <Field label={t.phone}><input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} /></Field>
        <Field label={t.followUpNote}><input className="input" value={note} onChange={(e) => setNote(e.target.value)} /></Field>
        <Field label={t.date}><input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} /></Field>
      </div>
      <button onClick={add} className="btn-primary">{t.addReminder}</button>
      <div className="space-y-2">
        {reminders.map((r) => {
          const link = `https://wa.me/${r.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(t.reminderLinkMsg.replace('{name}', r.name).replace('{note}', r.note))}`;
          return (
            <div key={r.id} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
              <div className="flex-1"><p className="font-medium text-slate-800">{r.name}</p><p className="text-xs text-slate-500">{r.phone} · {r.date} · {r.note}</p></div>
              <a href={link} target="_blank" rel="noreferrer" className="btn-secondary text-sm">{t.send}</a>
              <button onClick={() => del(r.id)} className="text-slate-400 hover:text-rose-500">✕</button>
            </div>
          );
        })}
        {reminders.length === 0 && <p className="text-center text-sm text-slate-400 py-6">{t.noReminders}</p>}
      </div>
    </div>
  );
}

export function WaAppointmentScheduler(_: { tool: Tool }) {
  const t = useT(S);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [service, setService] = useState('Consultation');

  const msg = t.appointmentMsg
    .replace('{name}', name)
    .replace('{service}', service)
    .replace('{date}', date)
    .replace('{time}', time);
  const link = phone ? `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}` : '';

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label={t.customerName}><input className="input" value={name} onChange={(e) => setName(e.target.value)} /></Field>
        <Field label={t.phone}><input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} /></Field>
        <Field label={t.date}><input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} /></Field>
        <Field label={t.time}><input type="time" className="input" value={time} onChange={(e) => setTime(e.target.value)} /></Field>
      </div>
      <Field label={t.service}><input className="input" value={service} onChange={(e) => setService(e.target.value)} /></Field>
      <div className="rounded-2xl bg-slate-900 p-5 text-accent-300 font-mono text-sm whitespace-pre-wrap">{msg}</div>
      <div className="flex justify-end gap-2">
        <CopyButton text={msg} label={t.copy} />
        {link && <a href={link} target="_blank" rel="noreferrer" className="btn-primary">{t.sendViaWhatsapp}</a>}
      </div>
    </div>
  );
}

export function WaOrderForm(_: { tool: Tool }) {
  const t = useT(S);
  const [items, setItems] = useState<{ name: string; qty: number; price: number }[]>([{ name: '', qty: 1, price: 0 }]);
  const [customer, setCustomer] = useState('');
  const [phone, setPhone] = useState('');
  const [addr, setAddr] = useState('');

  const total = items.reduce((s, it) => s + it.qty * it.price, 0);
  const itemsText = items.map((it, i) => t.orderItemLine.replace('{i}', String(i + 1)).replace('{name}', it.name).replace('{qty}', String(it.qty)).replace('{amount}', (it.qty * it.price).toFixed(2))).join('\n');
  const orderText = t.orderMsg
    .replace('{customer}', customer)
    .replace('{addr}', addr)
    .replace('{items}', itemsText)
    .replace('{total}', total.toFixed(2));
  const link = phone ? `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(orderText)}` : '';

  const updateItem = (i: number, key: string, val: any) => setItems((p) => p.map((it, j) => j === i ? { ...it, [key]: val } : it));

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-3 gap-3">
        <Field label={t.customerName}><input className="input" value={customer} onChange={(e) => setCustomer(e.target.value)} /></Field>
        <Field label={t.storePhone}><input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} /></Field>
        <Field label={t.deliveryAddress}><input className="input" value={addr} onChange={(e) => setAddr(e.target.value)} /></Field>
      </div>
      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i} className="grid grid-cols-12 gap-2">
            <input className="input col-span-5" placeholder={t.item} value={it.name} onChange={(e) => updateItem(i, 'name', e.target.value)} />
            <input type="number" className="input col-span-2" placeholder={t.qty} value={it.qty} onChange={(e) => updateItem(i, 'qty', +e.target.value || 0)} />
            <input type="number" className="input col-span-3" placeholder={t.price} value={it.price} onChange={(e) => updateItem(i, 'price', +e.target.value || 0)} />
            <button onClick={() => setItems((p) => p.filter((_, j) => j !== i))} className="col-span-2 btn-secondary text-sm">{t.remove}</button>
          </div>
        ))}
        <button onClick={() => setItems([...items, { name: '', qty: 1, price: 0 }])} className="btn-secondary text-sm">{t.addItem}</button>
      </div>
      <p className="text-right font-semibold">{t.total.replace('{total}', total.toFixed(2))}</p>
      <div className="rounded-2xl bg-slate-900 p-5 text-accent-300 font-mono text-sm whitespace-pre-wrap">{orderText}</div>
      <div className="flex justify-end gap-2">
        <CopyButton text={orderText} label={t.copyOrder} />
        {link && <a href={link} target="_blank" rel="noreferrer" className="btn-primary">{t.sendOrder}</a>}
      </div>
    </div>
  );
}

export function WaProductCatalog(_: { tool: Tool }) {
  const t = useT(S);
  const [products, setProducts] = useState<{ name: string; price: number; desc: string }[]>([{ name: 'Widget A', price: 19.99, desc: 'A great widget' }, { name: 'Gadget B', price: 29.99, desc: 'An amazing gadget' }]);
  const [phone, setPhone] = useState('15551234567');

  const productsText = products.map((p, i) => t.catalogProductLine.replace('{i}', String(i + 1)).replace('{name}', p.name).replace('{price}', p.price.toFixed(2)).replace('{desc}', p.desc)).join('\n\n');
  const catalogText = t.catalogMsg.replace('{products}', productsText);
  const link = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(catalogText)}`;
  const update = (i: number, key: string, val: any) => setProducts((p) => p.map((pr, j) => j === i ? { ...pr, [key]: val } : pr));

  return (
    <div className="space-y-4">
      <Field label={t.yourWhatsappNumber}><input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} /></Field>
      <div className="space-y-2">
        {products.map((p, i) => (
          <div key={i} className="grid grid-cols-12 gap-2">
            <input className="input col-span-4" placeholder={t.name} value={p.name} onChange={(e) => update(i, 'name', e.target.value)} />
            <input type="number" className="input col-span-2" placeholder="$" value={p.price} onChange={(e) => update(i, 'price', +e.target.value || 0)} />
            <input className="input col-span-4" placeholder={t.description} value={p.desc} onChange={(e) => update(i, 'desc', e.target.value)} />
            <button onClick={() => setProducts((p) => p.filter((_, j) => j !== i))} className="col-span-2 btn-secondary text-sm">{t.remove}</button>
          </div>
        ))}
        <button onClick={() => setProducts([...products, { name: '', price: 0, desc: '' }])} className="btn-secondary text-sm">{t.addProduct}</button>
      </div>
      <div className="rounded-2xl bg-slate-900 p-5 text-accent-300 font-mono text-sm whitespace-pre-wrap">{catalogText}</div>
      <div className="flex justify-end gap-2">
        <CopyButton text={catalogText} label={t.copyCatalog} />
        <a href={link} target="_blank" rel="noreferrer" className="btn-primary">{t.shareOnWhatsapp}</a>
      </div>
    </div>
  );
}

export function WaCustomerCard(_: { tool: Tool }) {
  const t = useT(S);
  const [customers, setCustomers] = useState<{ id: string; name: string; phone: string; email: string; notes: string }[]>(() => {
    try { return JSON.parse(localStorage.getItem('wa-customers') || '[]'); } catch { return []; }
  });
  const [name, setName] = useState(''); const [phone, setPhone] = useState(''); const [email, setEmail] = useState(''); const [notes, setNotes] = useState('');

  const add = () => {
    if (!name) return;
    const nc = { id: Math.random().toString(36).slice(2), name, phone, email, notes };
    const next = [nc, ...customers]; setCustomers(next); localStorage.setItem('wa-customers', JSON.stringify(next));
    setName(''); setPhone(''); setEmail(''); setNotes('');
  };
  const del = (id: string) => { const next = customers.filter((c) => c.id !== id); setCustomers(next); localStorage.setItem('wa-customers', JSON.stringify(next)); };

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label={t.name}><input className="input" value={name} onChange={(e) => setName(e.target.value)} /></Field>
        <Field label={t.phone}><input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} /></Field>
        <Field label={t.email}><input className="input" value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
        <Field label={t.notes}><input className="input" value={notes} onChange={(e) => setNotes(e.target.value)} /></Field>
      </div>
      <button onClick={add} className="btn-primary">{t.saveCustomer}</button>
      <div className="space-y-2">
        {customers.map((c) => (
          <div key={c.id} className="flex items-start gap-3 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100">
            <div className="flex-1">
              <p className="font-medium text-slate-800">{c.name}</p>
              <p className="text-xs text-slate-500">{c.phone} {c.email && `· ${c.email}`}</p>
              {c.notes && <p className="mt-1 text-xs text-slate-400">{c.notes}</p>}
            </div>
            {c.phone && <a href={`https://wa.me/${c.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="btn-secondary text-sm">{t.message}</a>}
            <button onClick={() => del(c.id)} className="text-slate-400 hover:text-rose-500">✕</button>
          </div>
        ))}
        {customers.length === 0 && <p className="text-center text-sm text-slate-400 py-6">{t.noCustomers}</p>}
      </div>
    </div>
  );
}

export function WaSurvey(_: { tool: Tool }) {
  const t = useT(S);
  const [topic, setTopic] = useState('How was your experience?');
  const [questions, setQuestions] = useState('How would you rate our service?\nWould you recommend us?');
  const [phone, setPhone] = useState('15551234567');
  const questionsText = questions.split('\n').filter(Boolean).map((q, i) => `${i + 1}. ${q}`).join('\n');
  const msg = t.surveyMsg.replace('{topic}', topic).replace('{questions}', questionsText);
  const link = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`;

  return (
    <div className="space-y-4">
      <Field label={t.surveyTopic}><input className="input" value={topic} onChange={(e) => setTopic(e.target.value)} /></Field>
      <Field label={t.questionsHint}><textarea className="input min-h-[100px]" value={questions} onChange={(e) => setQuestions(e.target.value)} /></Field>
      <Field label={t.sendToLabel}><input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} /></Field>
      <div className="rounded-2xl bg-slate-900 p-5 text-accent-300 font-mono text-sm whitespace-pre-wrap">{msg}</div>
      <div className="flex justify-end gap-2"><CopyButton text={msg} /><a href={link} target="_blank" rel="noreferrer" className="btn-primary">{t.sendSurvey}</a></div>
    </div>
  );
}

export function WaFeedbackForm(_: { tool: Tool }) {
  const t = useT(S);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [phone, setPhone] = useState('15551234567');
  const stars = '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  const msg = t.feedbackMsg
    .replace('{name}', name)
    .replace('{stars}', stars)
    .replace('{rating}', String(rating))
    .replace('{feedback}', feedback);
  const link = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`;

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label={t.yourName}><input className="input" value={name} onChange={(e) => setName(e.target.value)} /></Field>
        <Field label={t.sendToBusiness}><input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} /></Field>
      </div>
      <Field label={t.ratingLabel.replace('{rating}', String(rating))}><input type="range" min={1} max={5} value={rating} onChange={(e) => setRating(+e.target.value)} className="w-full accent-brand-600" /></Field>
      <Field label={t.yourFeedback}><textarea className="input min-h-[80px]" value={feedback} onChange={(e) => setFeedback(e.target.value)} /></Field>
      <div className="rounded-2xl bg-slate-900 p-5 text-accent-300 font-mono text-sm whitespace-pre-wrap">{msg}</div>
      <div className="flex justify-end gap-2"><CopyButton text={msg} /><a href={link} target="_blank" rel="noreferrer" className="btn-primary">{t.sendFeedback}</a></div>
    </div>
  );
}

readium-navigator-web.esm.js in 
@readium/navigator-web/dist

line 19725, instead of setting src in iframe,
must set
`iframe.setAttribute(
'srcdoc', basedContentData );`
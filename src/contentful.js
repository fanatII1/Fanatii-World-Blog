import * as contentful from 'contentful-management'

//module that manages the content of the CMS
export const client = contentful.createClient({
  space: import.meta.env.VITE_SPACE_ID,
  accessToken: 'CFPAT-JvsoTZkaiNAA82FtURp2m3L9WQ4wr6V1ntTC8li_6w4'
})
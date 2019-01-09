const { GraphQLScalarType } = require('graphql')
const { Kind } = require('graphql/language')
const fetch = require('node-fetch')

function sanify(object) {
  const list = []
  for (let slug in object) {
    list.push({
      slug,
      name: object[slug]
    })
  }
  return list
}

module.exports = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'The `Date` scalar type represents a precise moment in time.',
    parseValue: (input) => {
      return new Date(input)
    },
    serialize: (date) => {
      return date.getTime()
    },
    parseLiteral: (ast) => {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10)
      }
      return null
    }
  }),
  Query: {
    async events() {
      const json = await fetch('https://demo.digital.gov/events/index.json')
      const parsed = await json.json()
      return parsed.items.map((event) => {
        const splitStart = event.start_time.split(' ')
        const splitEnd = event.end_time.split(' ')
        event.topics = event.topics || {}
        return {
          title:   event.title,
          summary: event.summary,
          datePublished: new Date(event.date_published),
          dateModified:  new Date(event.date_modified),
          start: new Date(event.start_date + ', ' + splitStart.slice(0, splitStart.length - 1).join(' ')),
          end:   new Date(event.end_date + ', ' + splitEnd.slice(0, splitEnd.length - 1).join(' ')),
          types:  sanify(event.event_type),
          topics: sanify(event.topics),
          organizer: event.event_organizer,
          host: event.host,
          registrationURL: event.registration_url,
          branch: event.branch,
          location: {
            fileName: event.filename,
            filePath: event.filepath,
            fileURL:  event.filepathURL,
            editURL:  event.editpathURL,
            websitePath: event.url
          }
        }
      })
    },
    async resources() {
      const json = await fetch('https://demo.digital.gov/resources/index.json')
      const parsed = await json.json()
      return parsed.items.map((resource) => {
        resource.authors = resource.authors || {}
        resource.topics = resource.topics || {}
        return {
          title:   resource.title,
          deck:    resource.deck || null,
          summary: resource.summary,
          authors: sanify(resource.authors),
          topics:  sanify(resource.topics),
          datePublished: new Date(resource.date_published),
          dateModified:  new Date(resource.date_modified),
          branch: resource.branch,
          location: {
            fileName: resource.filename,
            filePath: resource.filepath,
            fileURL:  resource.filepathURL,
            editURL:  resource.editpathURL,
            websitePath: resource.url
          }
        }
      })
    },
    async services() {
      const json = await fetch('https://demo.digital.gov/services/index.json')
      const parsed = await json.json()
      return parsed.items.map((service) => {
        service.authors = service.authors || {}
        return {
          title:   service.title,
          deck:    service.deck || null,
          summary: service.summary,
          authors: sanify(service.authors),
          datePublished: new Date(service.date_published),
          dateModified:  new Date(service.date_modified),
          branch: service.branch,
          location: {
            fileName: service.filename,
            filePath: service.filepath,
            fileURL:  service.filepathURL,
            editURL:  service.editpathURL,
            websitePath: service.url
          }
        }
      })
    }
  }
}
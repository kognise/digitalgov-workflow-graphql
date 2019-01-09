const { GraphQLScalarType } = require('graphql')
const { Kind } = require('graphql/language')
const fetch = require('node-fetch')

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
        const types = []
        for (let slug in event.event_type) {
          types.push({
            slug,
            name: event.event_type[slug]
          })
        }
        event.topics = event.topics || {}
        const topics = []
        for (let slug in event.topics) {
          topics.push({
            slug,
            name: event.topics[slug]
          })
        }
        return {
          title:   event.title,
          summary: event.summary,
          datePublished: new Date(event.date_published),
          dateModified:  new Date(event.date_modified),
          start: new Date(event.start_date + ', ' + splitStart.slice(0, splitStart.length - 1).join(' ')),
          end:   new Date(event.end_date + ', ' + splitEnd.slice(0, splitEnd.length - 1).join(' ')),
          types, topics,
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
    }
  }
}
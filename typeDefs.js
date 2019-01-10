const { gql } = require('apollo-server')

module.exports = gql`
scalar Date

type SlugAndName {
  slug: String
  name: String
}

type Location {
  fileName: String
  filePath: String
  fileURL: String
  editURL: String
  websitePath: String
}

type Post {
  title: String
  summary: String
  deck: String
  datePublished: Date
  dateModified: Date
  authors: [SlugAndName]
  topics: [SlugAndName]
  branch: String
  location: Location
}

type Event {
  title: String
  summary: String
  datePublished: Date
  dateModified: Date
  start: Date
  end: Date
  types: [SlugAndName]
  topics: [SlugAndName]
  organizer: String
  host: String
  registrationURL: String
  branch: String
  location: Location
}

type Resource {
  title: String
  summary: String
  deck: String
  datePublished: Date
  dateModified: Date
  authors: [SlugAndName]
  topics: [SlugAndName]
  branch: String
  location: Location
}

type Service {
  title: String
  summary: String
  deck: String
  datePublished: Date
  dateModified: Date
  authors: [SlugAndName]
  branch: String
  location: Location
}

type Topic {
  san: SlugAndName
  weight: Int
  branch: String
  location: Location
}

type Query {
  posts: [Post]
  events: [Event]
  resources: [Resource]
  services: [Service]
  topics: [Topic]
}
`
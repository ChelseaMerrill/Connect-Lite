const { Neo4jGraphQL } = require("@neo4j/graphql");
const { ApolloServer, gql } = require("apollo-server");
const neo4j = require("neo4j-driver");

const typeDefs = gql`
    type Skill {
        name: String
        people: [Person!]! @relationship(type: "HAS_SKILL", direction: IN)
    }

    type Person {
        name: String
        skills: [Skill!]! @relationship(type: "HAS_SKILL", direction: OUT)
    }

`;


const driver = neo4j.driver(
    "bolt://localhost:7687",
    neo4j.auth.basic("neo4j", "password")
);


const neoSchema = new Neo4jGraphQL({ typeDefs, driver });

neoSchema.getSchema().then((schema) => {
    const server = new ApolloServer({
        schema,
    });
  
    server.listen().then(({ url }) => {
        console.log(`🚀 Server ready at ${url}`);
    });
  })
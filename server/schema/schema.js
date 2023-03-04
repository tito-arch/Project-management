const Project = require('../models/Project');
const Client = require('../models/Client');


 

const { GraphQLObjectType,
        GraphQLID,
        GraphQLString, 
        GraphQLSchema, 
        GraphQLList,
        GraphQLNonNull,
        GraphQLEnumType,
      } = require('graphql');

// PROJECT TYPE

const ProjectType = new GraphQLObjectType({
  name: 'Project',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    client:{
      type: ClientType,
      resolve(parent, args){
        return Client.findById(parent.clientId);
      }
    }
  }),
});


// CLIENT TYPE

const ClientType = new GraphQLObjectType({
  name: 'Client',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
   
//PROJECTS
  projects:{
    type: new GraphQLList(ProjectType),
    resolve(parent, args){
      return Project.find();
    }
  },
  project: {
    type: ProjectType,
    args: { id: { type: GraphQLID }},
    resolve(parent, args) {
      return Project.findById(args.id);
    }  
  },

  //CLIENTS
    clients:{
      type: new GraphQLList(ClientType),
      resolve(parent, args){
        return Client.find();
      }
    },
    client: {
      type: ClientType,
      args: { id: { type: GraphQLID }},
      resolve(parent, args) {
        return Client.findById(args.id);
      }  
    }
  }
});

//MUTATIONS START HERE

const mutation = new GraphQLObjectType({
  name:'mutation',
  fields:{
    //ADD A CLIENT
    addClient: {
      type: ClientType,
      args: {
        name: {type: GraphQLNonNull(GraphQLString)},
        email: {type: GraphQLNonNull(GraphQLString)},
        phone: {type: GraphQLNonNull(GraphQLString)},
      },
      resolve(parent, args){
        const client = new Client({
          name:args.name,
          email:args.email,
          phone:args.phone,

        });

        return client.save();
      }
    },
    //DELETE A CLIENT
    deleteClient:{
      type: ClientType,
      args:{
        id: {type: GraphQLNonNull(GraphQLID)},
        
      },
      resolve(parent, args) {
        return Client.findByIdAndRemove(args.id);
          
      }

    },
    // ADD A PROJECT
    addProject:{
      type: ProjectType,
      args:{
        name: {type: GraphQLNonNull(GraphQLString)},
        description: {type: GraphQLNonNull(GraphQLString)},
        status:{
          type: new GraphQLEnumType({
            name : 'ProjectStatus',
            values:{
              'new': {value: 'Not Started'},
              'progress': {value: 'In Progress'},
              'completed': {value: 'completed'},
            }
          }),
         defaultValue: 'Not Started',
        },
        ClientId: {type:GraphQLNonNull(GraphQLID)},
      },
      resolve(parent, args) {
        const project = new Project({
          name : args.name,
          description: args.description,
          clientId:args.ClientId,
        });
        return project.save();
      }
    }
  }

});
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
});

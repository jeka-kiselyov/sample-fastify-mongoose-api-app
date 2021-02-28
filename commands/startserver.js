const { Program, Command } = require('lovacli');

const Server = require('../server/Server.js');
const fastifyServerAuth = require('../server/FastifyServerAuth.js');
const fastifyCookie = require('fastify-cookie');
const fastifyFormbody = require('fastify-formbody');
const fastifyMongooseAPI = require('fastify-mongoose-api');

class Handler extends Command {
    setup(progCommand) {
        progCommand.description('Start the server');
    }

    async handle(args, options, logger) {
        await this.db.init();

        let settings = {};
        try {
            settings = require('../settings/settings.js');
        } catch(e) {
            logger.error("Can not load settings from settings/settings.js");
            settings = {};
        };

        let serverOptions = settings.server || {};
        serverOptions.logger = logger;

        serverOptions.beforeInit = (fastify)=>{

            fastify.register(fastifyCookie);
            fastify.register(fastifyFormbody);
            fastify.register(fastifyServerAuth, {
                    getUserByUsername: async (username)=>{
                        return await this.db.User.byUsername(username);
                    },
                    storeAuthCode: async (user, authCode)=>{
                        return await user.storeAuthCode(authCode);
                    },
                    getUserByAuthCode: async (authCode)=>{
                        return await this.db.User.byAuthCode(authCode);
                    }
                });

            fastify.register(fastifyMongooseAPI, {
                    models: this.db.connection.models,
                    checkAuth: (request, reply)=>{
                        if (request.raw.url.indexOf('user') != -1) {
                            /// just a quick way to disable /user/ and /user_authes/ routes on API
                            throw new Error('Cmon!');
                        }
                        request.requireAuth();
                    },
                    prefix: '/api/',
                    setDefaults: true,
                    methods: ['list', 'get', 'post', 'patch', 'put', 'delete', 'options']
                });
        };

        let server = new Server(serverOptions);
        await server.init();
    }
};

module.exports = Handler;
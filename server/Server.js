const { Program, Command, LovaClass } = require('lovacli');
const path = require('path');
const fs = require('fs');
const webpack = require("webpack");
const Fastify = require('fastify');

class Server extends LovaClass { /// LovaClass is also EventEmmiter
    constructor(params = {}) {
        super(params);
        this._server = null;
        this._logger = params.logger || null;
        this._ds = params.ds || null;

        this._events = [];

        this._beforeInit = params.beforeInit || null;

        this._outData = {
            index: {
                content: null,
                fileName: path.join(__dirname, '../frontend/index.html'),
                contentType: 'text/html',
                livereload: true
            },
            favicon: {
                content: null,
                fileName: path.join(__dirname, '../frontend/favicon.ico'),
                contentType: 'image/x-icon'
            },
            robotstxt: {
                content: null,
                fileName: path.join(__dirname, '../frontend/robots.txt'),
                contentType: 'text/plain'
            },
            indexjs: {
                content: null,
                fileName: path.join(__dirname, '../frontend/webpack.config.js'),
                compiledFileName: path.join(__dirname, '../frontend/dist/index.js'),
                contentType: 'text/javascript',
                webpack: true,
                watch: true,
                livereload: true
            }
        };

        // this._credentials = params.credentials || [];
        // if (!Array.isArray(this._credentials)) {
        //     this._credentials = [this._credentials];
        // }

        // ///// very simple and rude security hack - we ask server for random nonce before each signin and use it as salf for password hashing
        // ///// that's why, in theory, we will have random hash sending over http each time
        // this._authNonces = [];

        // ///// we store auth results here.
        // this._authCodes = [];


        // this._checkAuthIP = params.checkAuthIP;   /// restrict authCodes to work from same IP they were created from
        // this._maxAuthCodeAge = params.maxAuthCodeAge; /// restrict authCode age to seconds

        this._port = params.port || 8080;

        this._enableLivereload = params.enableLivereload || false;
        this._enableWebpackWatch = params.enableWebpackWatch || false;
        this._enableWebpackBuild = params.enableWebpackBuild || false;
	}

    log(str) {
        if (this._logger) {
            this._logger.debug(str);
        } else {
            console.log(str);
        }
    }

    async init() {
        this.log('Creating server instance...');
        this._server = Fastify();

        if (typeof this._beforeInit === "function") {
            this._beforeInit(this._server);
        }

        this._server.get('/*', {}, this.asyncWrap(this.index));
        this._server.get('/favicon.ico', {}, this.asyncWrap(this.favicon));
        this._server.get('/index.js', {}, this.asyncWrap(this.indexjs));
        this._server.get('/robots.txt', {}, this.asyncWrap(this.robotstxt));

        // this._server.post('/api/authNonce', this.asyncWrap(this.authNonce));
        // this._server.post('/api/auth', this.asyncWrap(this.auth));

        await this._server.ready();
        await this._server.listen(this._port, '0.0.0.0');

        this.log('Server listening at port #'+this._port);

        await this.initLivereload();
    }

    async initLivereload() {
        if (!this._enableLivereload) {
            return false;
        }

        let pathes = [];

        for (const [key, outData] of Object.entries(this._outData)) {
            if (outData.livereload) {
                let fileName = outData.compiledFileName || outData.fileName || null;
                if (fileName) {
                    pathes.push(fileName);
                }
            }
        }

        if (pathes) {
            this.log("Setting up LiveReload server to watch on "+pathes.length+" pathes...");

            try {
                const livereload = require('livereload');
                const server = livereload.createServer();
                server.on('error', ()=>{
                    this.log("Error initializing LiveReload server");                    
                });
                server.watch(pathes);
            } catch(e) {
                console.log(e);
                this.log("Error initializing LiveReload server");
            }
        }
    }

    asyncWrap(fn, checkAuth) {
        return async (req, res)=>{
            this.log('Server request: '+req.raw.url);
            await fn.call(this, req, res);
            // let authCheckPromise = null;


            // if (checkAuth) {
            //     authCheckPromise = new Promise((resolve, reject)=>{
            //         let authCode = req.cookies.authCode || null;
            //         for (let auth of this._authCodes) {
            //             if (auth.authCode == authCode) {
            //                 if (this._checkAuthIP) {
            //                     if (auth.ip != req.connection.remoteAddress) {
            //                         return resolve(false);
            //                     }
            //                 }
            //                 if (this._checkAuthDate) {
            //                     let now = new Date();
            //                     if (!auth.date || ( Math.abs(now.getTime() - auth.date.getTime()) > this._maxAuthCodeAge * 1000 ) ) {
            //                         return resolve(false);
            //                     }
            //                 }
            //                 return resolve(true);
            //             }
            //         }
            //         resolve(false);
            //     });
            // } else {
            //     authCheckPromise = Promise.resolve(true);
            // }

            // authCheckPromise = Promise.resolve(true);

            // authCheckPromise.then((authSuccess)=>{
            //     if (!authSuccess) {
            //         throw new errs.UnauthorizedError("Can you please auth first?");
            //     }

            //     return fn.call(this, req, res);
            // }).then(function(results){
            //     next();
            // }).catch(function(err){
            //     return next(err);
            // });      
        };
    }

    // async authNonce(req, res) {
    //     let randomNonce = crypto.randomBytes(128).toString('hex');
    //     this._authNonces.push(randomNonce);
    //     if (this._authNonces.length > 10) {
    //         /// store up to 10 last nonces. We are targeting simple tool apps here, so no more than 10 parallel 
    //         /// signin are more than enough
    //         this._authNonces = this._authNonces.slice(-10);
    //     }

    //     res.send({
    //         nonce: randomNonce
    //     });
    // }

    // async auth(req, res) {
    //     let ret = {
    //         success: false,
    //         authCode: null
    //     };

    //     let username = req.params.username;
    //     let passwordHash = req.params.password;

    //     let hashIsGood = false;
    //     for (let i = 0; i < this._authNonces.length; i++) {
    //         let nonce = this._authNonces[i];

    //         for (let credentials of this._credentials) {
    //             if (username == credentials.username) {
    //                 let hash = crypto.createHash('md5').update(''+nonce+''+credentials.password).digest("hex");
    //                 if (hash == passwordHash) {
    //                     hashIsGood = true;
    //                     /// remove this nonce from authNonces. To be sure we use it once only
    //                     this._authNonces.splice(i, 1);
    //                 }                           
    //             }         
    //         }
    //     }

    //     if (hashIsGood) {
    //         ret.success = true;
    //         let authCode = crypto.randomBytes(128).toString('hex');
    //         ret.authCode = authCode;

    //         this._authCodes.push({
    //             authCode: authCode,
    //             ip: req.connection.remoteAddress,
    //             date: new Date()
    //         });

    //         if (this._authCodes.length > 10) {
    //             let now = new Date();

    //             //// we are cleaning authCodes that are outdated
    //             for (let i = 0; i < this._authCodes.length; i++) {
    //                 let auth = this._authCodes[i];
    //                 if (now.getTime() - auth.date.getTime() > this._maxAuthCodeAge*1000) {
    //                     this._authCodes.splice(i, 1);
    //                     i--; /// keep index on the next item even though it's moved, without this, we'd skip one item in the loop
    //                 }
    //             }

    //             //// just limit the total count to 1000 to be sure we are not eating too much memory
    //             this._authCodes = this._authCodes.slice(-1000);
    //         }

    //         let authCookieOptions = {
    //         };

    //         if (this._maxAuthCodeAge) {
    //             authCookieOptions.maxAge = this._maxAuthCodeAge;
    //         }

    //         res.setCookie('authCode', authCode, authCookieOptions);   
    //     }

    //     if (!ret.success) {
    //         res.status(401); 
    //         res.send(ret);
    //     } else {
    //         res.send(ret);            
    //     }
    // }

    async getOutData(name) {
        if (this._outData[name] && this._outData[name].content !== null) {
            return this._outData[name];
        }

        try {
            if (this._outData[name].webpack && !this._enableWebpackBuild) {
                /// if we are not using webpack - use already compiled code
                this._outData[name].fileName = this._outData[name].compiledFileName;
            }

            if (this._outData[name].webpack && this._enableWebpackBuild) {
                this.log("Compiling "+this._outData[name].fileName+" with webpack...");

                let compilerOptions = require(path.join(__dirname, '../frontend/webpack.config.js'));
                let compiler = webpack(compilerOptions);
                
                let promise = new Promise((resolve, reject)=>{
                    compiler.run((err, stats) => {
                        if (err) {
                            return reject(err);
                        }
                        this._outData[name].hash = stats.hash || null;

                        resolve(true);
                    });
                });

                try {
                    await promise;
                    this.log("Compiled to "+this._outData[name].compiledFileName);
                    this._outData[name].content = fs.readFileSync(this._outData[name].compiledFileName);
                } catch(e) {
                    this.log(e);
                    this._outData[name].content = null;
                }  


                if (this._outData[name].watch && this._enableWebpackWatch) {
                    const watching = compiler.watch({
                            // Example watchOptions
                            aggregateTimeout: 300,
                            poll: undefined
                        }, (err, stats) => {
                            if (stats && stats.hash && stats.hash != this._outData[name].hash) {
                                this._outData[name].hash = stats.hash;
                                this.log("Webpack sources for "+name+" have been changed");
                                this._outData[name].content = null;
                            }
                        });                    
                }
            } else {
                this.log("Reading content from "+this._outData[name].fileName+"  ...");
                if (this._outData[name].livereload) {
                    /// do not cache files for livereload. This is the quick hack for index.html
                    let content = fs.readFileSync(this._outData[name].fileName);
                    let obj = Object.assign({}, this._outData[name]);
                    obj.content = content;
                    return obj;
                } else {
                    this._outData[name].content = fs.readFileSync(this._outData[name].fileName);                        
                }            
            }
        } catch(e) {
            this.log(e);
            this._outData[name].content = null;
        }

        return this._outData[name];
    }

    async index(req, res) {
        let outData = await this.getOutData('index');
        res.header('content-type', outData.contentType);
        res.send(outData.content);
    }

    async indexjs(req, res) {
        let outData = await this.getOutData('indexjs');
        res.header('content-type', outData.contentType);
        res.send(outData.content);
    }

    async robotstxt(req, res) {
        req.requireAuth();
        console.log(req.user);

        let outData = await this.getOutData('robotstxt');
        res.header('content-type', outData.contentType);
        res.send(outData.content);
    }

    async favicon(req, res) {
        let outData = await this.getOutData('favicon');
        res.header('content-type', outData.contentType);
        res.send(outData.content);
    }
}

module.exports = Server;
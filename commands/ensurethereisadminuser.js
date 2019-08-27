const { Program, Command } = require('lovacli');

class Handler extends Command {
    setup(progCommand) {
        progCommand.description('Adds admin user with username: admin, pw: admin (for testing)');
    }

    async handle(args, options, logger) {
        await this.db.init();

        let adminUser = await this.db.User.byUsername('admin');
        if (!adminUser) {
            adminUser = new this.db.User;
            adminUser.username = 'admin';
            adminUser.password = 'admin';

            await adminUser.save();
        }
    }
};

module.exports = Handler;
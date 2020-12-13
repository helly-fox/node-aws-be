"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_service_1 = require("./app.service");
let AppController = class AppController {
    constructor(appService, configService) {
        this.appService = appService;
        this.configService = configService;
    }
    async proxyRequest(req, res) {
        const { method, originalUrl, body } = req;
        const [, recipient, ...restUrlParams] = originalUrl.split('/');
        const recipientUrl = this.configService.get(recipient);
        if (!recipientUrl) {
            return res.status(502).json({ error: 'Cannot process request' });
        }
        try {
            const { data } = await this.appService.proxyRequest(Object.assign({ method: method, url: `${recipientUrl}${restUrlParams.join('/')}` }, (Object.keys(body || {}).length && { data: body })));
            return res.json(data);
        }
        catch (error) {
            if (error.response && error.status) {
                const { status, data } = error;
                res.status(status).json(data);
            }
            else {
                res.status(500).json({ error: error.message });
            }
        }
    }
};
__decorate([
    common_1.All(),
    __param(0, common_1.Req()), __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "proxyRequest", null);
AppController = __decorate([
    common_1.Controller('*'),
    __metadata("design:paramtypes", [app_service_1.AppService,
        config_1.ConfigService])
], AppController);
exports.AppController = AppController;
//# sourceMappingURL=app.controller.js.map
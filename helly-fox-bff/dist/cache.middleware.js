"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheMiddleware = void 0;
const apicache = require('apicache');
function cacheMiddleware(req, res, next) {
    apicache.middleware('2 minutes')(req, res, next);
}
exports.cacheMiddleware = cacheMiddleware;
;
//# sourceMappingURL=cache.middleware.js.map
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterRoutes = void 0;
/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const runtime_1 = require("@tsoa/runtime");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const controller_1 = require("./../controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const models = {
    "Memo": {
        "dataType": "refObject",
        "properties": {
            "number": { "dataType": "double", "required": true },
            "content": { "dataType": "string", "required": true },
            "tags": { "dataType": "array", "array": { "dataType": "string" }, "required": true },
            "createdAt": { "dataType": "string", "required": true },
            "updatedAt": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const validationService = new runtime_1.ValidationService(models);
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
function RegisterRoutes(router) {
    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################
    router.post('/api/login', ...((0, runtime_1.fetchMiddlewares)(controller_1.MemoController)), ...((0, runtime_1.fetchMiddlewares)(controller_1.MemoController.prototype.login)), function MemoController_login(context, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = {
                undefined: { "in": "body", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "password": { "dataType": "string", "required": true }, "username": { "dataType": "string", "required": true } } },
            };
            let validatedArgs = [];
            try {
                validatedArgs = getValidatedArgs(args, context, next);
            }
            catch (err) {
                const error = err;
                context.status = error.status;
                context.throw(error.status, JSON.stringify({ fields: error.fields }));
            }
            const controller = new controller_1.MemoController();
            const promise = controller.login.apply(controller, validatedArgs);
            return promiseHandler(controller, promise, context, undefined, undefined);
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    router.delete('/api/logout', ...((0, runtime_1.fetchMiddlewares)(controller_1.MemoController)), ...((0, runtime_1.fetchMiddlewares)(controller_1.MemoController.prototype.logout)), function MemoController_logout(context, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = {
                token: { "in": "header", "name": "Authorization", "required": true, "dataType": "string" },
            };
            let validatedArgs = [];
            try {
                validatedArgs = getValidatedArgs(args, context, next);
            }
            catch (err) {
                const error = err;
                context.status = error.status;
                context.throw(error.status, JSON.stringify({ fields: error.fields }));
            }
            const controller = new controller_1.MemoController();
            const promise = controller.logout.apply(controller, validatedArgs);
            return promiseHandler(controller, promise, context, undefined, undefined);
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    router.get('/api/memo/:number', ...((0, runtime_1.fetchMiddlewares)(controller_1.MemoController)), ...((0, runtime_1.fetchMiddlewares)(controller_1.MemoController.prototype.getMemo)), function MemoController_getMemo(context, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = {
                number: { "in": "path", "name": "number", "required": true, "dataType": "double" },
                token: { "in": "header", "name": "Authorization", "required": true, "dataType": "string" },
            };
            let validatedArgs = [];
            try {
                validatedArgs = getValidatedArgs(args, context, next);
            }
            catch (err) {
                const error = err;
                context.status = error.status;
                context.throw(error.status, JSON.stringify({ fields: error.fields }));
            }
            const controller = new controller_1.MemoController();
            const promise = controller.getMemo.apply(controller, validatedArgs);
            return promiseHandler(controller, promise, context, undefined, undefined);
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    router.get('/api/memo', ...((0, runtime_1.fetchMiddlewares)(controller_1.MemoController)), ...((0, runtime_1.fetchMiddlewares)(controller_1.MemoController.prototype.getMemos)), function MemoController_getMemos(context, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = {
                token: { "in": "header", "name": "Authorization", "required": true, "dataType": "string" },
            };
            let validatedArgs = [];
            try {
                validatedArgs = getValidatedArgs(args, context, next);
            }
            catch (err) {
                const error = err;
                context.status = error.status;
                context.throw(error.status, JSON.stringify({ fields: error.fields }));
            }
            const controller = new controller_1.MemoController();
            const promise = controller.getMemos.apply(controller, validatedArgs);
            return promiseHandler(controller, promise, context, undefined, undefined);
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    router.post('/api/memo', ...((0, runtime_1.fetchMiddlewares)(controller_1.MemoController)), ...((0, runtime_1.fetchMiddlewares)(controller_1.MemoController.prototype.createMemo)), function MemoController_createMemo(context, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = {
                undefined: { "in": "body", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "tags": { "dataType": "array", "array": { "dataType": "string" }, "required": true }, "content": { "dataType": "string", "required": true } } },
                token: { "in": "header", "name": "Authorization", "required": true, "dataType": "string" },
            };
            let validatedArgs = [];
            try {
                validatedArgs = getValidatedArgs(args, context, next);
            }
            catch (err) {
                const error = err;
                context.status = error.status;
                context.throw(error.status, JSON.stringify({ fields: error.fields }));
            }
            const controller = new controller_1.MemoController();
            const promise = controller.createMemo.apply(controller, validatedArgs);
            return promiseHandler(controller, promise, context, undefined, undefined);
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    router.put('/api/memo/:number', ...((0, runtime_1.fetchMiddlewares)(controller_1.MemoController)), ...((0, runtime_1.fetchMiddlewares)(controller_1.MemoController.prototype.updateMemo)), function MemoController_updateMemo(context, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = {
                number: { "in": "path", "name": "number", "required": true, "dataType": "double" },
                undefined: { "in": "body", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "tags": { "dataType": "array", "array": { "dataType": "string" }, "required": true }, "content": { "dataType": "string", "required": true } } },
                token: { "in": "header", "name": "Authorization", "required": true, "dataType": "string" },
            };
            let validatedArgs = [];
            try {
                validatedArgs = getValidatedArgs(args, context, next);
            }
            catch (err) {
                const error = err;
                context.status = error.status;
                context.throw(error.status, JSON.stringify({ fields: error.fields }));
            }
            const controller = new controller_1.MemoController();
            const promise = controller.updateMemo.apply(controller, validatedArgs);
            return promiseHandler(controller, promise, context, undefined, undefined);
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    router.delete('/api/memo/:number', ...((0, runtime_1.fetchMiddlewares)(controller_1.MemoController)), ...((0, runtime_1.fetchMiddlewares)(controller_1.MemoController.prototype.deleteMemo)), function MemoController_deleteMemo(context, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = {
                number: { "in": "path", "name": "number", "required": true, "dataType": "double" },
                token: { "in": "header", "name": "Authorization", "required": true, "dataType": "string" },
            };
            let validatedArgs = [];
            try {
                validatedArgs = getValidatedArgs(args, context, next);
            }
            catch (err) {
                const error = err;
                context.status = error.status;
                context.throw(error.status, JSON.stringify({ fields: error.fields }));
            }
            const controller = new controller_1.MemoController();
            const promise = controller.deleteMemo.apply(controller, validatedArgs);
            return promiseHandler(controller, promise, context, undefined, undefined);
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    function isController(object) {
        return 'getHeaders' in object && 'getStatus' in object && 'setStatus' in object;
    }
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    function promiseHandler(controllerObj, promise, context, successStatus, next) {
        return Promise.resolve(promise)
            .then((data) => {
            let statusCode = successStatus;
            let headers;
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            if (isController(controllerObj)) {
                headers = controllerObj.getHeaders();
                statusCode = controllerObj.getStatus() || statusCode;
            }
            return returnHandler(context, next, statusCode, data, headers);
        })
            .catch((error) => {
            context.status = error.status || 500;
            context.throw(context.status, error.message, error);
        });
    }
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    function returnHandler(context, next, statusCode, data, headers = {}) {
        if (!context.headerSent && !context.response.__tsoaResponded) {
            if (data !== null && data !== undefined) {
                context.body = data;
                context.status = 200;
            }
            else {
                context.status = 204;
            }
            if (statusCode) {
                context.status = statusCode;
            }
            context.set(headers);
            context.response.__tsoaResponded = true;
            return next ? next() : context;
        }
    }
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    function getValidatedArgs(args, context, next) {
        const errorFields = {};
        const values = Object.keys(args).map(key => {
            const name = args[key].name;
            switch (args[key].in) {
                case 'request':
                    return context.request;
                case 'query':
                    return validationService.ValidateParam(args[key], context.request.query[name], name, errorFields, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'queries':
                    return validationService.ValidateParam(args[key], context.request.query, name, errorFields, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'path':
                    return validationService.ValidateParam(args[key], context.params[name], name, errorFields, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'header':
                    return validationService.ValidateParam(args[key], context.request.headers[name], name, errorFields, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'body':
                    return validationService.ValidateParam(args[key], context.request.body, name, errorFields, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'body-prop':
                    return validationService.ValidateParam(args[key], context.request.body[name], name, errorFields, 'body.', { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'formData':
                    if (args[key].dataType === 'file') {
                        return validationService.ValidateParam(args[key], context.request.file, name, errorFields, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                    }
                    else if (args[key].dataType === 'array' && args[key].array.dataType === 'file') {
                        return validationService.ValidateParam(args[key], context.request.files, name, errorFields, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                    }
                    else {
                        return validationService.ValidateParam(args[key], context.request.body[name], name, errorFields, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                    }
                case 'res':
                    return responder(context, next);
            }
        });
        if (Object.keys(errorFields).length > 0) {
            throw new runtime_1.ValidateError(errorFields, '');
        }
        return values;
    }
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    function responder(context, next) {
        return function (status, data, headers) {
            returnHandler(context, next, status, data, headers);
        };
    }
    ;
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}
exports.RegisterRoutes = RegisterRoutes;
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

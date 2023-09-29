"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.MemoController = void 0;
const tsoa_1 = require("tsoa");
const service_1 = require("./service");
const repository_1 = require("./repository");
// All dependencies are injected here.
// For simplicity, dependency injection framework is not used.
const repository = new repository_1.PrismaRepository();
const memoService = new service_1.MemoService(repository);
let MemoController = class MemoController {
    constructor(service = memoService) {
        this.service = service;
        this.tokens = new Map();
    }
    authorize(token) {
        const userId = this.tokens.get(token);
        if (userId === undefined) {
            throw new Error("Unauthorized");
        }
        return userId;
    }
    authenticate(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.service.verifyUser({ username, password });
            const token = Math.random().toString(36).slice(2);
            this.tokens.set(token, user.id);
            return token;
        });
    }
    deauthenticate(token) {
        return __awaiter(this, void 0, void 0, function* () {
            this.tokens.delete(token);
        });
    }
    login({ username, password }) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.authenticate(username, password);
        });
    }
    logout(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.deauthenticate(token);
        });
    }
    getMemo(number, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = this.authorize(token);
            return this.service.findMemo({ userId, number });
        });
    }
    getMemos(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = this.authorize(token);
            return this.service.listMemo({ userId });
        });
    }
    createMemo({ content, tags }, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = this.authorize(token);
            return this.service.createMemo({ userId, content, tags });
        });
    }
    updateMemo(number, { content, tags }, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = this.authorize(token);
            return this.service.updateMemo({ userId, number, content, tags });
        });
    }
    deleteMemo(number, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = this.authorize(token);
            return this.service.deleteMemo({ userId, number });
        });
    }
};
exports.MemoController = MemoController;
__decorate([
    (0, tsoa_1.Post)("login"),
    __param(0, (0, tsoa_1.Body)())
], MemoController.prototype, "login", null);
__decorate([
    (0, tsoa_1.Delete)("logout"),
    __param(0, (0, tsoa_1.Header)("Authorization"))
], MemoController.prototype, "logout", null);
__decorate([
    (0, tsoa_1.Get)("memo/{number}"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Header)("Authorization"))
], MemoController.prototype, "getMemo", null);
__decorate([
    (0, tsoa_1.Get)("memo"),
    __param(0, (0, tsoa_1.Header)("Authorization"))
], MemoController.prototype, "getMemos", null);
__decorate([
    (0, tsoa_1.Post)("memo"),
    __param(0, (0, tsoa_1.Body)()),
    __param(1, (0, tsoa_1.Header)("Authorization"))
], MemoController.prototype, "createMemo", null);
__decorate([
    (0, tsoa_1.Put)("memo/{number}"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __param(2, (0, tsoa_1.Header)("Authorization"))
], MemoController.prototype, "updateMemo", null);
__decorate([
    (0, tsoa_1.Delete)("memo/{number}"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Header)("Authorization"))
], MemoController.prototype, "deleteMemo", null);
exports.MemoController = MemoController = __decorate([
    (0, tsoa_1.Route)("/")
], MemoController);

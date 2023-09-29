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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoService = void 0;
const crypto_1 = __importDefault(require("crypto"));
function getRandomHexString(length) {
    return crypto_1.default.randomBytes(length).toString("hex");
}
function hash(password, salt) {
    return new Promise((resolve, reject) => {
        crypto_1.default.pbkdf2(password, salt, 10000, 256, "sha256", (err, key) => {
            if (err)
                return reject(err);
            resolve(key.toString("base64"));
        });
    });
}
class MemoService {
    constructor(repository) {
        this.repository = repository;
    }
    findMemo({ userId, number, }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.findMemo({ userId, number });
        });
    }
    listMemo({ userId, tags, }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.listMemo({ userId, tags });
        });
    }
    createMemo({ userId, content, tags, }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.createMemo({ userId, content, tags });
        });
    }
    updateMemo({ userId, number, content, tags, }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.updateMemo({ userId, number, content, tags });
        });
    }
    deleteMemo({ userId, number, }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.deleteMemo({ userId, number });
        });
    }
    addUser({ username, password, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const salt = getRandomHexString(32);
            const passwordHash = yield hash(password, salt);
            yield this.repository.addUser({ username, passwordHash, salt });
        });
    }
    verifyUser({ username, password, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.repository.getUser({ username });
            if (!user)
                throw new Error("User not found");
            const { id, hashedPassword, salt } = user;
            if ((yield hash(password, salt)) !== hashedPassword)
                throw new Error("Password mismatch");
            return { id, username };
        });
    }
}
exports.MemoService = MemoService;

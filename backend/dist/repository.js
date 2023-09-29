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
exports.PrismaRepository = exports.clearUnrelatedTags = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function convertToMemo(memoSchema) {
    return {
        number: memoSchema.number,
        content: memoSchema.content,
        tags: memoSchema.tags.map((tag) => tag.value),
        createdAt: memoSchema.createdAt.toISOString(),
        updatedAt: memoSchema.updatedAt.toISOString(),
    };
}
function clearUnrelatedTags({ userId }) {
    return prisma.tag.deleteMany({
        where: {
            userId,
            memos: { none: { NOT: [{ id: -1 }] } },
        },
    });
}
exports.clearUnrelatedTags = clearUnrelatedTags;
class PrismaRepository {
    findMemo({ userId, number, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield prisma.memo.findFirst({
                where: { number, userId },
                select: {
                    id: true,
                    userId: true,
                    number: true,
                    content: true,
                    tags: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
            if (!result)
                throw new Error("Not found");
            const memo = convertToMemo(result);
            return memo;
        });
    }
    listMemo({ userId, tags, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield prisma.memo.findMany({
                where: tags
                    ? {
                        userId,
                        tags: {
                            some: { value: { in: tags } },
                        },
                    }
                    : { userId },
                select: {
                    id: true,
                    userId: true,
                    number: true,
                    content: true,
                    tags: true,
                    createdAt: true,
                    updatedAt: true,
                },
                orderBy: { updatedAt: "desc" },
            });
            return results.map(convertToMemo);
        });
    }
    listTags({ userId }) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield prisma.tag.findMany({
                where: { userId },
                select: { value: true },
                orderBy: { value: "asc" },
            });
            return results.map((tag) => tag.value);
        });
    }
    createMemo({ userId, content, tags, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const newNumber = (yield prisma.memo.aggregate({
                where: {
                    userId,
                },
                _max: {
                    number: true,
                },
            }))._max.number || 0 + 1;
            // Upsert tags
            const tagIds = yield Promise.all(tags.map((value) => __awaiter(this, void 0, void 0, function* () {
                return (yield prisma.tag.upsert({
                    where: { userId_value: { userId, value } },
                    create: { userId, value },
                    update: { value },
                })).id;
            })));
            const memo = yield prisma.memo.create({
                data: {
                    userId,
                    content,
                    tags: { connect: tagIds.map((id) => ({ id })) },
                    number: newNumber,
                },
                include: {
                    tags: true,
                },
            });
            return convertToMemo(memo);
        });
    }
    updateMemo({ userId, number, content, tags, }) {
        return __awaiter(this, void 0, void 0, function* () {
            // Upsert tags
            const tagIds = yield Promise.all(tags.map((value) => __awaiter(this, void 0, void 0, function* () {
                return (yield prisma.tag.upsert({
                    where: { userId_value: { userId, value } },
                    create: { userId, value },
                    update: { value },
                })).id;
            })));
            const memo = yield prisma.memo.update({
                where: { userId_number: { userId, number } },
                data: {
                    content,
                    tags: {
                        set: tagIds.map((id) => ({ id })),
                    },
                },
                include: {
                    tags: true,
                },
            });
            return convertToMemo(memo);
        });
    }
    deleteMemo({ userId, number, }) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prisma.memo.deleteMany({ where: { userId, number } });
        });
    }
    addUser({ username, passwordHash, salt, }) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prisma.user.create({
                data: { username, hashedPassword: passwordHash, salt },
            });
        });
    }
    getUser({ username }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma.user.findUnique({ where: { username } });
            if (!user)
                throw new Error("Not found");
            return user;
        });
    }
}
exports.PrismaRepository = PrismaRepository;

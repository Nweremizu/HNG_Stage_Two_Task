import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient();

prisma.$use(async (params, next) => {
    if (params.model === 'User' && params.action === 'create') {
        const hashedPassword = await bcrypt.hash(params.args.data.password, 10)
        params.args.data.password = hashedPassword
    }
    return next(params)
}
)

export default prisma;
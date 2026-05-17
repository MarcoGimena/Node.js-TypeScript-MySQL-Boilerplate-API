import { expressjwt } from 'express-jwt';
import config from '../config.json';
import db from '../_helpers/db';

const { secret } = config;

export default function authorize(roles: any = []) {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        // ✅ STEP 1: Read and verify JWT from Bearer token
        expressjwt({
            secret,
            algorithms: ['HS256'],
            getToken: (req: any) => {
                const authHeader = req.headers.authorization;

                if (!authHeader) return null;

                if (authHeader.startsWith('Bearer ')) {
                    return authHeader.split(' ')[1];
                }

                return null;
            }
        }),

        // ✅ STEP 2: Check user + roles
        async (req: any, res: any, next: any) => {
            try {
                // ❌ no token decoded
                if (!req.auth || !req.auth.id) {
                    return res.status(401).json({ message: 'Invalid or missing token' });
                }

                const account = await db.Account.findByPk(req.auth.id);

                // ❌ user not found
                if (!account) {
                    return res.status(401).json({ message: 'Account not found' });
                }

                // ❌ role check
                if (roles.length && !roles.includes(account.role)) {
                    return res.status(401).json({ message: 'Unauthorized (role)' });
                }

                // attach role to request
                req.auth.role = account.role;

                const refreshTokens = await account.getRefreshTokens();

                req.auth.ownsToken = (token: any) =>
                    !!refreshTokens.find((x: any) => x.token === token);

                next();
            } catch (err) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
        }
    ];
}
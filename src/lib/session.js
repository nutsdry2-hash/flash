import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

const opts = {
  password: process.env.SESSION_SECRET || 'shop-secret-key-must-be-32chars-long!',
  cookieName: 'shop_sess',
  cookieOptions: { secure: process.env.NODE_ENV === 'production', httpOnly: true, maxAge: 60*60*24*7 }
};

export function getSession() {
  return getIronSession(cookies(), opts);
}

import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./db/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compareSync } from "bcrypt-ts-edge";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const config = {
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  adapter: PrismaAdapter(prisma), // the Prisma adapter is to integrate Next Auth with Prisma.
  providers: [
    CredentialsProvider({
      credentials: {
        email: {
          type: "email",
        },
        password: {
          type: "password",
        },
      },
      async authorize(credentials) {
        if (credentials == null) return null;
        // find user in db
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        });
        // if password correct, return user
        if (user && user.password) {
          const isMatch = compareSync(
            credentials.password as string,
            user.password
          );

          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }
        // If user doesn't exist or password is incorrect, return null
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ user, token, account, session, trigger }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        // use first part of email if user has no name
        if (user.name === "NO_NAME") {
          token.name = user.email.split("@")[0];
        }

        if (["signIn", "signUp"].includes(trigger)) {
          const sessionCartId = (await cookies()).get("sessionCartId")?.value;
          if (sessionCartId) {
            const sessionCart = await prisma.cart.findFirst({
              where: { sessionCartId },
            });
            if (sessionCart) {
              // overwrite any existing user cart
              await prisma.cart.deleteMany({
                where: {
                  userId: user.id,
                },
              });
              // assign the guest cart to the logged-in user
              await prisma.cart.update({
                where: {
                  id: sessionCart.id,
                },
                data: {
                  userId: user.id,
                },
              });
            }
          }
        }
      }
      // Handle session updates (e.g., name change)
      if (session?.user.name && trigger === "update") {
        token.name = session.user.name;
      }
      return token;
    },

    async session({ session, user, trigger, token }: any) {
      session.user.id = token.sub;
      session.user.role = token.role;
      if (trigger === "update") {
        session.user.name = user.name;
      }
      return session;
    },
    /*********** AUTHORIZED() CALLBACK ***************/
    /* if the below callback returns false, This tells NextAuth
     * to block access and automatically redirect the user to the
     * signIn page you defined in config.pages.signIn.
     */

    // The global authorized callback is your first line of defense
    // it also handles mutliple tabs open case, if you are signed in as an admin for example then signed out from one tab, then if you tried to navigate on the first tab to a protected/admin route then it will automatically redirect you to /sign-in page
    // but you need a second line of defense for authorization (admin role check) and to secure your UI/data-fetching logic.

    /**
     * The authorized callback checks "Is this user logged in?"
     * but it doesn't check "Is this logged-in user an admin?".
     *
     * Authentication (Are you logged in?): ✅ Handled by the global authorized callback.
     * Authorization (Are you an admin?): ❌ Not handled. A logged-in regular user could access /admin routes right now... so if user hard typed the url to go to /admin/whatever he will access it!
     */

    /**
     * What happened? The global authorized callback in your auth.ts correctly intercepted the request 
       from the signed-out tab and redirected you. This is working perfectly.

     * What's missing? You are only checking authentication (is the user logged in?) but not authorization (is this user an admin?).
       What to do?
        - Keep the global authorized callback. It's your essential first layer of security.
        - Add an authorization layer using a requireAdmin() function.
        - Use this function in all your Admin Page/Layout Server Components and all your Admin API Routes.
        - Use useSession() in client components for UI logic.

      This two-layered approach (global auth + specific role checks) is the professional and secure way to handle admin routes in Next.js.
     */
    /*********** End AUTHORIZED() CALLBACK ***************/
    authorized({ auth, request }: any) {
      // array of regex patterns of paths we want to protect
      const protectedPaths = [
        /\/shipping-address/,
        /\/payment-method/,
        /\/place-order/,
        /\/profile/,
        /\/user\/(.*)/,
        /\/order\/(.*)/,
        /\/admin/,
      ];

      const { pathname } = request.nextUrl;

      /* returns false so will block guests from accessing protected routes
       * and redirect them to signin page instead which is defined in the
       * pages obj above in the config
       */
      if (!auth && protectedPaths.some((p) => p.test(pathname))) return false;

      // Check for cart cookie
      if (!request.cookies.get("sessionCartId")) {
        // Generate cart cookie
        const sessionCartId = crypto.randomUUID();

        // Clone the request headers
        const newRequestHeaders = new Headers(request.headers);

        // Create a new response and add the new headers
        const response = NextResponse.next({
          request: {
            headers: newRequestHeaders,
          },
        });

        // Set the newly generated sessionCartId in the response cookies
        response.cookies.set("sessionCartId", sessionCartId);

        // Return the response with the sessionCartId set
        return response;
      } else {
        return true;
      }
    },
  },
} satisfies NextAuthConfig;

export const { handlers, signIn, signOut, auth } = NextAuth(config);

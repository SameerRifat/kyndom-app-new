import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "src/lib/prisma";

export async function POST(request: NextRequest) {
    const prisma = getPrismaClient();

    const { userId } = await request.json();

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                onboarded: true,
                subscriptions: {
                    where: {
                        status: 'ACTIVE',
                    },
                    select: {
                        status: true,
                    },
                },
            },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

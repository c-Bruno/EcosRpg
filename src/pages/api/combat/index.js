import { prisma } from '../../../database';

export default async function handler(req, res) {
    if(req.method === 'POST') {
        const { body } = req;

        if(!body.weapon) {
            return res.status(400).json({ error: 'Name not set' });
        }

        const combat = await prisma.combat.create({
            data: body
        });

        // Assign Created combat to All Characters
        const characters = await prisma.character.findMany({
            where: { id: body.character_id },
        });

        characters.forEach(async character => {
            await prisma.characterCombat.create({
                data: {
                    character_id: character.id,
                    combat_id: combat.id
                }
            });
        });

        return res.status(200).json(combat);
    }
    else if(req.method === 'GET') {
        const combat = await prisma.combat.findMany({
            orderBy: [{ weapon: 'asc'}]
        });

        return res.status(200).json(combat);
    }
    else {
        return res.status(404);
    }
}
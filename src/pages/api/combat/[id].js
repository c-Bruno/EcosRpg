import { prisma } from '../../../database';

export default async function handler(req, res) {
    if(req.method === 'DELETE') {
        const id = Number(req.query.id);
        const deleteFromCharacterCombat = prisma.characterCombat.deleteMany({
            where: {
                combat_id: id
            }
        });

        const deleteCombat = prisma.combat.delete({
            where: {
                id
            }
        });

        await prisma.$transaction([deleteFromCharacterCombat, deleteCombat]);

        return res.status(200).json({ success: true });
    }
    else if(req.method === 'PUT') {
        const { body } = req;

        if(!body.weapon) {
            return res.status(400).json({ error: 'Weapon not set' });
        }
        
        const id = Number(req.query.id);   
        const combat = await prisma.combat.update({
            where: { id },
            data: body
        });

        return res.status(200).json(combat);
    }
    else {
        return res.status(404);
    }
}
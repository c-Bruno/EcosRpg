import { prisma } from '../../../database';

export default async function handler(req, res) {
    if(req.method === 'DELETE') {
        const id = Number(req.query.id);

        const deleteFromCharacterInventory= prisma.characterInventory.deleteMany({
            where: {
                inventory_id: id
            }
        });

        const deleteInventory = prisma.inventory.delete({
            where: {
                id: id
            }
        });

        await prisma.$transaction([deleteFromCharacterInventory, deleteInventory]);

        return res.status(200).json({ success: true });
    }
    else if(req.method === 'PUT') {
        const { body } = req;

        if(!body.description) {
            return res.status(400).json({ error: 'Name not set' });
        }
    
        const id = Number(req.query.id);
        const inventory = await prisma.inventory.update({
            where: { id },
            data: body
        });

        return res.status(200).json(inventory);
    }
    else {
        return res.status(404);
    }
}
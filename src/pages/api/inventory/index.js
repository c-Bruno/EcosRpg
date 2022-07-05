import { prisma } from '../../../database';

export default async function handler(req, res) {
    if(req.method === 'POST') {
        const { body } = req;
        
        if(!body.description) {
            return res.status(400).json({ error: 'Name not set' });
        }
        
        const inventory = await prisma.inventory.create({
            data: body
        });

        // Assign Created Inventory to a Character
        const character = await prisma.character.findMany({
            where: { id: body.character_id },
        })

        character.forEach(async character => {
            await prisma.characterInventory.create({
                data: {
                    character_id: character.id,
                    inventory_id: inventory.id
                }
            });
        });

        return res.status(200).json(inventory);
    }
    else if(req.method === 'GET') {
        const inventorys = await prisma.inventory.findMany({
            orderBy: [{ description: 'asc'}]
        });

        return res.status(200).json(inventorys);
    }
    else {
        return res.status(404);
    }
}
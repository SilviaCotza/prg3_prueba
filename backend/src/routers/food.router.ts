import { Router } from 'express';
import { sample_foods, sample_tags } from '../data';
import asyncHandler from 'express-async-handler';
import { FoodModel } from '../models/food.model';
import dbConnect from "../configs/database.config";
const router = Router();

/*router.get(
  '/seed',
  asyncHandler(async (req, res) => {
      try {
          const foodsCountResult = await dbConnect('SELECT COUNT(*) FROM food');
          const foodsCount = parseInt(foodsCountResult[0].count, 10);

          if (foodsCount > 0) {
              res.send('Seed is already done!');
              return;
          }

          for (const food of sample_foods) {
              await dbConnect(
                  `INSERT INTO food (id, name, cooktime, price, favorite, origins, stars, imageurl, tags)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
              [food.id, food.name, food.cooktime, food.price, food.favorite, food.origins, food.stars, food.imageurl, food.tags.join(',')]
      );
      }

          res.send('Seed Is Done!');
      } catch (error) {
          console.error('Error during seeding:', error);
          res.status(500).send('Error during seeding');
      }
  }));
*/

router.get(
    '/',// Este endpoint obtiene todos los alimentos
    asyncHandler(async (req, res) => {
        try {
            const food = await dbConnect`SELECT * FROM "food"`;

            if (food.length === 0) {
                res.status(404).send('No se encontraron alimentos');
                return;
            }

            res.send(food);
        } catch (error) {
            console.error('Error al buscar los alimentos:', error);
            res.status(500).send('Error al buscar los alimentos');
        }

    })
);

router.get(
  '/search/:searchTerm',// Este endpoint busca alimentos por su nombre
  asyncHandler(async(req, res) => { //se cambió el endpoint para que funcione con postgres
          const { name } = req.body;
          try {
              const food = await dbConnect
                  `SELECT * FROM "food" WHERE name = ${name}`;

              if (food.length === 0) {
                  res.status(404).send('Alimento no encontrado prueba');
                    return;
              }
                res.send(food[0]);

          } catch (error) {
              console.error('Error al buscar el alimento:', error);
              res.status(500).send('Error al buscar el alimento');
          }res.send(name);

      })
  );

router.get(
  '/tags',// Este endpoint obtiene todas las etiquetas de alimentos
  asyncHandler(async (req, res) => {
    const tags = await FoodModel.aggregate([
      {
        $unwind: '$tags',
      },
      {
        $group: {
          _id: '$tags',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          name: '$_id',
          count: '$count',
        },
      },
    ]).sort({ count: -1 });

    const all = {
      name: 'All',
      count: await FoodModel.countDocuments(),
    };

    tags.unshift(all);
    res.send(tags);
  })
);

router.get(
  '/tag/:tagName', // Este endpoint busca alimentos por su etiqueta
    asyncHandler(async(req, res) => { //se cambió el endpoint para que funcione con postgres
        const { tags } = req.body;
        try {
            const food = await dbConnect
                `SELECT * FROM "food" WHERE tags = ${tags}`;

            if (food.length === 0) {
                res.status(404).send('Alimento no encontrado');
                return;
            }
            res.send(food[0]);

        } catch (error) {
            console.error('Error al buscar el alimento:', error);
            res.status(500).send('Error al buscar el alimento');
        }res.send(tags);
        res.send(tags);
    })
);

router.get(
  '/:foodId',// Este endpoint busca un alimento por su id
  asyncHandler(async (req, res) => {
      const { id } = req.body;
      try {
          const food = await dbConnect
              `SELECT * FROM "food" WHERE id = ${id}`;

          if (food.length === 0) {
              res.status(404).send('Alimento no encontrado');
              return;
          }
          res.send(food[0]);

      } catch (error) {
          console.error('Error al buscar el alimento:', error);
          res.status(500).send('Error al buscar el alimento');
      }
      res.send(id);

  }
)
);


export default router;

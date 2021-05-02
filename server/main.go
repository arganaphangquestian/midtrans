package main

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/segmentio/ksuid"
)

type product struct {
	ID          string `json:"id"`
	ProducName  string `json:"product_name"`
	Price       uint64 `json:"price"`
	Description string `json:"description"`
}

type transaction struct {
	ID      string  `json:"ID"`
	Product product `json:"product"`
	Amount  uint8   `json:"amount"`
	IsPaid  bool    `json:"is_paid"`
}

var products = []product{
	{
		ID:          "1",
		ProducName:  "Asus TUF Gaming",
		Price:       20_000_000,
		Description: "New brand from asus for portable compact gaming gear",
	},
	{
		ID:          "2",
		ProducName:  "Mackbook Pro M1 13\"", // Mackbook Pro M1 13"
		Price:       35_000_000,
		Description: "New brand from Apple",
	},
}

var transactions = []transaction{}

func main() {
	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
	}))

	app.Get("/", func(ctx *fiber.Ctx) error {
		return ctx.Status(200).JSON(&fiber.Map{
			"message": "App is running",
		})
	})

	// URL => /api/products -> GET
	app.Get("/api/products", func(ctx *fiber.Ctx) error {
		return ctx.Status(200).JSON(&fiber.Map{
			"message": "Get all products",
			"data":    products,
		})
	})

	// URL => /api/products/id -> GET
	app.Get("/api/products/:id", func(ctx *fiber.Ctx) error {
		// Search by ID
		var res *product // nil
		for _, v := range products {
			if v.ID == ctx.Params("id") {
				res = &v
				break
			}
		}
		if res != nil {
			return ctx.Status(200).JSON(&fiber.Map{
				"message": fmt.Sprintf("Get product by ID %s", ctx.Params("id")),
				"data":    res,
			})
		} else {
			return ctx.Status(404).JSON(&fiber.Map{
				"message": "Data not found",
			})
		}
	})

	// URL => /api/products/:id -> POST, body {amount}
	app.Post("/api/products/:id", func(ctx *fiber.Ctx) error {
		// Search by ID
		var res *product // nil
		for _, v := range products {
			if v.ID == ctx.Params("id") {
				res = &v
				break
			}
		}
		if res != nil {
			// put your logic here
			type body struct {
				Amount uint8 `json:"amount"`
			}
			amount := new(body)

			if err := ctx.BodyParser(amount); err != nil || amount == nil { // amount not provided
				return ctx.Status(500).JSON(&fiber.Map{
					"message": "Serialization error or missing amount",
				})
			}

			id := ksuid.New().String()
			trans := transaction{
				ID:      id,
				Product: *res,
				Amount:  amount.Amount,
				IsPaid:  false,
			}

			transactions = append(transactions, trans)

			// 201 -> Created
			return ctx.Status(201).JSON(&fiber.Map{
				"message": "Transaction created",
				"data":    trans,
			})
		} else {
			return ctx.Status(404).JSON(&fiber.Map{
				"message": "Data not found",
			})
		}
	})

	app.Get("/api/transactions", func(ctx *fiber.Ctx) error {
		return ctx.Status(200).JSON(&fiber.Map{
			"message": "Get All transactions",
			"data":    transactions,
		})
	})

	app.Listen("0.0.0.0:8080")
}

import { body, validationResult } from "express-validator";

export const PRODUCT_CATEGORIES = [
    "Living Room",
    "Bedroom",
    "Dining Room",
    "Office",
    "Outdoor",
    "Storage",
];

export const PRODUCT_SUBCATEGORIES = [
    "Sofas",
    "Sofa Cum Beds",
    "Recliners",
    "Dining Sets",
    "Coffee Tables",
    "TV Units",
    "Dressing Tables",
    "Mattresses",
    "Tables",
    "Chairs",
    "Beds",
    "Wardrobes",
    "Desks",
    "Shelving",
    "Storage",
    "Lighting",
];

export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const list = errors.array();
        return res.status(400).json({
            success: false,
            message: list[0]?.msg || "Validation failed",
            errors: list,
        });
    }
    next();
};

export const validateRegister = [
    body("name")
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Name must be 2–100 characters"),
    body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
    body("password")
        .isLength({ min: 8, max: 128 })
        .withMessage("Password must be 8–128 characters"),
    handleValidationErrors,
];

export const validateLogin = [
    body("email").trim().isEmail().withMessage("Valid email required"),
    body("password")
        .notEmpty()
        .isLength({ max: 128 })
        .withMessage("Password required"),
    handleValidationErrors,
];

export const validateProduct = [
    body("name")
        .trim()
        .isLength({ min: 3, max: 200 })
        .withMessage("Product name must be 3–200 characters"),
    body("description")
        .trim()
        .isLength({ min: 10, max: 8000 })
        .withMessage("Description must be 10–8000 characters"),
    body("price").isFloat({ gt: 0 }).withMessage("Price must be a positive number"),
    body("category").isIn(PRODUCT_CATEGORIES).withMessage("Invalid category"),
    body("subCategory")
        .isIn(PRODUCT_SUBCATEGORIES)
        .withMessage("Invalid subCategory"),
    body("length").isFloat({ min: 0.1 }).withMessage("Length must be greater than 0"),
    body("breadth").isFloat({ min: 0.1 }).withMessage("Breadth must be greater than 0"),
    body("height").isFloat({ min: 0.1 }).withMessage("Height must be greater than 0"),
    body("stock")
        .optional({ values: "falsy" })
        .isInt({ min: 0 })
        .withMessage("Stock must be a non-negative integer"),
    body("bestseller")
        .optional({ values: "falsy" })
        .isIn(["true", "false"])
        .withMessage("bestseller must be true or false"),
    body("mrp")
        .optional({ values: "falsy" })
        .isFloat({ gt: 0 })
        .withMessage("MRP must be a positive number"),
    body("material").optional().isString().isLength({ max: 200 }),
    body("seating").optional().isString().isLength({ max: 50 }),
    body("warranty").optional().isString().isLength({ max: 100 }),
    body("madeToOrder").optional().isIn([true, false, "true", "false"]),
    body("frame").optional().isString().isLength({ max: 200 }),
    body("foamDensity").optional().isString().isLength({ max: 100 }),
    body("finish").optional().isString().isLength({ max: 200 }),
    body("weight").optional().isString().isLength({ max: 50 }),
    body("badge").optional().isString().isLength({ max: 30 }).withMessage("Badge must be 30 characters or fewer"),
    body("slug").optional().isString().isLength({ max: 80 }),
    body("seoTitle").optional().isString().isLength({ max: 70 }).withMessage("SEO title must be 70 characters or fewer"),
    body("seoDescription").optional().isString().isLength({ max: 170 }).withMessage("SEO description must be 170 characters or fewer"),
    handleValidationErrors,
];

export const validateProductUpdate = [
    body("id").isMongoId().withMessage("Invalid product"),
    body("name").optional().trim().isLength({ min: 3, max: 200 }).withMessage("Product name must be 3–200 characters"),
    body("description").optional().trim().isLength({ min: 10, max: 8000 }).withMessage("Description must be 10–8000 characters"),
    body("price").optional().isFloat({ gt: 0 }).withMessage("Price must be a positive number"),
    body("category").optional().isIn(PRODUCT_CATEGORIES).withMessage("Invalid category"),
    body("subCategory").optional().isIn(PRODUCT_SUBCATEGORIES).withMessage("Invalid subCategory"),
    body("length").optional().isFloat({ min: 0.1 }).withMessage("Length must be greater than 0"),
    body("breadth").optional().isFloat({ min: 0.1 }).withMessage("Breadth must be greater than 0"),
    body("height").optional().isFloat({ min: 0.1 }).withMessage("Height must be greater than 0"),
    body("stock").optional().isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),
    body("mrp")
        .optional({ values: "falsy" })
        .isFloat({ gt: 0 })
        .withMessage("MRP must be a positive number"),
    body("material").optional().isString().isLength({ max: 200 }),
    body("seating").optional().isString().isLength({ max: 50 }),
    body("warranty").optional().isString().isLength({ max: 100 }),
    body("madeToOrder").optional().isIn([true, false, "true", "false"]),
    body("frame").optional().isString().isLength({ max: 200 }),
    body("foamDensity").optional().isString().isLength({ max: 100 }),
    body("finish").optional().isString().isLength({ max: 200 }),
    body("weight").optional().isString().isLength({ max: 50 }),
    body("badge").optional().isString().isLength({ max: 30 }).withMessage("Badge must be 30 characters or fewer"),
    body("slug").optional().isString().isLength({ max: 80 }),
    body("seoTitle").optional().isString().isLength({ max: 70 }).withMessage("SEO title must be 70 characters or fewer"),
    body("seoDescription").optional().isString().isLength({ max: 170 }).withMessage("SEO description must be 170 characters or fewer"),
    handleValidationErrors,
];

const LEAD_TYPES_PUBLIC = ["visit", "custom", "callback", "bulk", "newsletter", "product"];

export const validateLead = [
    body("type").isIn(LEAD_TYPES_PUBLIC).withMessage("Invalid enquiry type"),
    body("name")
        .if(body("type").not().equals("newsletter"))
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Please enter your name"),
    body("phone")
        .if(body("type").not().equals("newsletter"))
        .trim()
        .matches(/^[+]?[0-9\s-]{10,15}$/)
        .withMessage("Please enter a valid phone number"),
    body("email")
        .if(body("type").equals("newsletter"))
        .trim()
        .isEmail()
        .withMessage("Please enter a valid email"),
    body("email").optional({ values: "falsy" }).trim().isEmail().normalizeEmail().withMessage("Please enter a valid email"),
    body("message").optional().isString().isLength({ max: 2000 }).withMessage("Message is too long"),
    body("preferredDate").optional().isString().isLength({ max: 20 }),
    body("preferredTime").optional().isString().isLength({ max: 20 }),
    body("budget").optional().isString().isLength({ max: 50 }),
    body("productId").optional().isString().isLength({ max: 50 }),
    body("productName").optional().isString().isLength({ max: 200 }),
    // honeypot: real users never fill this hidden field
    body("website").custom((v) => !v).withMessage("Invalid submission"),
    handleValidationErrors,
];

export const validateForgotPassword = [
    body("email").trim().isEmail().normalizeEmail().withMessage("Valid email required"),
    handleValidationErrors,
];

export const validateResetPassword = [
    body("token").trim().notEmpty().withMessage("Reset token required"),
    body("newPassword")
        .isLength({ min: 8, max: 128 })
        .withMessage("Password must be 8–128 characters"),
    handleValidationErrors,
];

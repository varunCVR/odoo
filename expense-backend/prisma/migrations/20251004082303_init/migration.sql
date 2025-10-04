-- CreateTable
CREATE TABLE `Company` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(120) NOT NULL,
    `country_code` CHAR(2) NOT NULL,
    `default_currency` CHAR(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `name` VARCHAR(120) NOT NULL,
    `email` VARCHAR(160) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_company_id_email_key`(`company_id`, `email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Role` (
    `id` INTEGER NOT NULL,
    `code` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Role_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserRole` (
    `user_id` BIGINT NOT NULL,
    `role_id` INTEGER NOT NULL,

    PRIMARY KEY (`user_id`, `role_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EmployeeProfile` (
    `user_id` BIGINT NOT NULL,
    `manager_id` BIGINT NULL,
    `require_manager_first` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ApprovalRule` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `name` VARCHAR(120) NOT NULL,
    `min_percentage_approve` TINYINT NULL,
    `hybrid_logic` ENUM('NONE', 'PERCENTAGE', 'SPECIFIC', 'HYBRID') NOT NULL DEFAULT 'NONE',
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ApprovalStep` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `rule_id` BIGINT NOT NULL,
    `step_no` INTEGER NOT NULL,
    `approver_role` ENUM('MANAGER', 'FINANCE', 'DIRECTOR', 'CUSTOM') NOT NULL,
    `approver_user_id` BIGINT NULL,

    UNIQUE INDEX `ApprovalStep_rule_id_step_no_key`(`rule_id`, `step_no`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ApprovalSpecific` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `rule_id` BIGINT NOT NULL,
    `user_id` BIGINT NOT NULL,
    `auto_approve` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `ApprovalSpecific_rule_id_user_id_key`(`rule_id`, `user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FxRate` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `base_currency` CHAR(3) NOT NULL,
    `quote_currency` CHAR(3) NOT NULL,
    `rate` DECIMAL(18, 8) NOT NULL,
    `quoted_at` DATETIME(3) NOT NULL,

    INDEX `FxRate_base_currency_quote_currency_quoted_at_idx`(`base_currency`, `quote_currency`, `quoted_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Expense` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `employee_id` BIGINT NOT NULL,
    `status` ENUM('DRAFT', 'PENDING', 'PARTIALLY_APPROVED', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'DRAFT',
    `description` VARCHAR(500) NULL,
    `category` VARCHAR(80) NOT NULL,
    `expense_date` DATE NOT NULL,
    `paid_by` ENUM('Self', 'Company') NOT NULL DEFAULT 'Self',
    `amount_original` DECIMAL(18, 2) NOT NULL,
    `currency_original` CHAR(3) NOT NULL,
    `amount_company` DECIMAL(18, 2) NOT NULL,
    `currency_company` CHAR(3) NOT NULL,
    `fx_rate_id` BIGINT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `Expense_company_id_status_idx`(`company_id`, `status`),
    INDEX `Expense_employee_id_expense_date_idx`(`employee_id`, `expense_date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExpenseItem` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `expense_id` BIGINT NOT NULL,
    `line_desc` VARCHAR(200) NULL,
    `line_amount` DECIMAL(18, 2) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Receipt` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `expense_id` BIGINT NOT NULL,
    `storage_key` VARCHAR(255) NOT NULL,
    `filename` VARCHAR(160) NOT NULL,
    `mime_type` VARCHAR(80) NOT NULL,
    `uploaded_by` BIGINT NULL,
    `uploaded_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExpenseApproval` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `expense_id` BIGINT NOT NULL,
    `step_no` INTEGER NOT NULL,
    `approver_id` BIGINT NOT NULL,
    `decision` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `comments` VARCHAR(500) NULL,
    `decided_at` DATETIME(3) NULL,

    INDEX `ExpenseApproval_expense_id_decision_idx`(`expense_id`, `decision`),
    UNIQUE INDEX `ExpenseApproval_expense_id_step_no_approver_id_key`(`expense_id`, `step_no`, `approver_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AuditLog` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `company_id` BIGINT NOT NULL,
    `actor_id` BIGINT NULL,
    `entity_type` VARCHAR(40) NOT NULL,
    `entity_id` BIGINT NOT NULL,
    `action` VARCHAR(40) NOT NULL,
    `payload` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Company`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserRole` ADD CONSTRAINT `UserRole_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserRole` ADD CONSTRAINT `UserRole_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmployeeProfile` ADD CONSTRAINT `EmployeeProfile_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmployeeProfile` ADD CONSTRAINT `EmployeeProfile_manager_id_fkey` FOREIGN KEY (`manager_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApprovalRule` ADD CONSTRAINT `ApprovalRule_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Company`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApprovalStep` ADD CONSTRAINT `ApprovalStep_rule_id_fkey` FOREIGN KEY (`rule_id`) REFERENCES `ApprovalRule`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApprovalStep` ADD CONSTRAINT `ApprovalStep_approver_user_id_fkey` FOREIGN KEY (`approver_user_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApprovalSpecific` ADD CONSTRAINT `ApprovalSpecific_rule_id_fkey` FOREIGN KEY (`rule_id`) REFERENCES `ApprovalRule`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApprovalSpecific` ADD CONSTRAINT `ApprovalSpecific_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Expense` ADD CONSTRAINT `Expense_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Company`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Expense` ADD CONSTRAINT `Expense_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Expense` ADD CONSTRAINT `Expense_fx_rate_id_fkey` FOREIGN KEY (`fx_rate_id`) REFERENCES `FxRate`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExpenseItem` ADD CONSTRAINT `ExpenseItem_expense_id_fkey` FOREIGN KEY (`expense_id`) REFERENCES `Expense`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Receipt` ADD CONSTRAINT `Receipt_expense_id_fkey` FOREIGN KEY (`expense_id`) REFERENCES `Expense`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Receipt` ADD CONSTRAINT `Receipt_uploaded_by_fkey` FOREIGN KEY (`uploaded_by`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExpenseApproval` ADD CONSTRAINT `ExpenseApproval_expense_id_fkey` FOREIGN KEY (`expense_id`) REFERENCES `Expense`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExpenseApproval` ADD CONSTRAINT `ExpenseApproval_approver_id_fkey` FOREIGN KEY (`approver_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AuditLog` ADD CONSTRAINT `AuditLog_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

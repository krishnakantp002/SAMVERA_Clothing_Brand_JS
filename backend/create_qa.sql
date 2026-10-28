CREATE TABLE ProductQuestion (
  id VARCHAR(191) NOT NULL,
  productId VARCHAR(191) NOT NULL,
  userId VARCHAR(191) NULL,
  userName VARCHAR(191) NULL,
  userEmail VARCHAR(191) NULL,
  question TEXT NOT NULL,
  answer TEXT NULL,
  status VARCHAR(191) NOT NULL DEFAULT 'PENDING',
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL,
  PRIMARY KEY (id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE ProductQuestion ADD CONSTRAINT ProductQuestion_productId_fkey FOREIGN KEY (productId) REFERENCES Product(id) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE ProductQuestion ADD CONSTRAINT ProductQuestion_userId_fkey FOREIGN KEY (userId) REFERENCES User(id) ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX ProductQuestion_productId_idx ON ProductQuestion(productId);
CREATE INDEX ProductQuestion_status_idx ON ProductQuestion(status);

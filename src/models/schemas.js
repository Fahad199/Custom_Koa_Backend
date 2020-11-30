const { DataTypes } = require('sequelize');

module.exports = {
  blogsSchema: {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },
      allowNull: false,
    },
    contactNo: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  userSchema: {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
    },
  },
  contactUsSchema: {
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },
      allowNull: false,
    },
    mobileNo: {
      type: DataTypes.BIGINT,
    },
    query: {
      type: DataTypes.TEXT,
    },
  },
  imageSchema: {
    name: { type: DataTypes.STRING, allowNull: true },
    extension: { type: DataTypes.STRING, allowNull: false },
    mimeType: { type: DataTypes.STRING, allowNull: false },
    relativePath: { type: DataTypes.STRING, allowNull: false },
    userName: { type: DataTypes.STRING, allowNull: true },
    deletedAt: { type: DataTypes.STRING, allowNull: true },
  },
  blogsImageSchema: {
    blogId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'blogs',
        key: 'id',
      },
    },
    imageId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'attachments',
        key: 'id',
      },
    },
  },
  emailSchema: {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },
      allowNull: false,
      unique: true,
    },
  },
  emailSubscriptionsSchema: {
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },
      allowNull: false,
      unique: true,
    },
    subscription_date: {
      type: DataTypes.DATE,
    }
  },
  careerSchema: {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    contactNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    jobTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    attachmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }
};

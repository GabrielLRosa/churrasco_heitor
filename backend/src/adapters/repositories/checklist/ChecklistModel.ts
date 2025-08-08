import { Model, DataTypes } from 'sequelize';
import sequelize from '../../../infra/db/sequelize';
import { ChecklistAttributes } from '../../../core/entities/checklist/Checklist';

class ChecklistModel extends Model<ChecklistAttributes> {}

ChecklistModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    tank_full: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    has_step: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    has_license: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
        field: 'created_at',
        defaultValue: DataTypes.NOW,
      }
  },
  {
    sequelize,
    tableName: 'checklists',
    timestamps: false,
  }
);

export { ChecklistModel }
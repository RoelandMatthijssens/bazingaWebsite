# This migration comes from refinery_products (originally 8)
class AddPromoteFieldToProductCategories < ActiveRecord::Migration
  def change
    add_column Refinery::Products::Category.table_name, :promote, :integer
  end
end

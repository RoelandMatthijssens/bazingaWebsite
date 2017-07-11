# This migration comes from refinery_products (originally 6)
class AddFileIdToProducts < ActiveRecord::Migration
  def change
    add_column Refinery::Products::Product.table_name, :file_id, :integer
    add_index Refinery::Products::Product.table_name, :file_id
  end
end
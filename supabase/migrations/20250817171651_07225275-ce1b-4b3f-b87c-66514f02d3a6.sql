-- Cesium ile ilgili tabloları CASCADE ile sil
DROP TABLE IF EXISTS cesium_files CASCADE;
DROP TABLE IF EXISTS cesium_layers CASCADE;
DROP TABLE IF EXISTS cesium_projects CASCADE;
DROP TABLE IF EXISTS cesium_project_permissions CASCADE;
DROP TABLE IF EXISTS cesium_notes CASCADE;

-- Cesium ile ilgili fonksiyonları sil  
DROP FUNCTION IF EXISTS has_project_access(uuid, uuid);

-- Cesium ile ilgili storage bucket'ını sil
DELETE FROM storage.buckets WHERE id = 'cesium-files';
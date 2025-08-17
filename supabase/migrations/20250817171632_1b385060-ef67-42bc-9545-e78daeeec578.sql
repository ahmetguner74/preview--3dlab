-- Cesium ile ilgili tabloları sil
DROP TABLE IF EXISTS cesium_files;
DROP TABLE IF EXISTS cesium_layers;
DROP TABLE IF EXISTS cesium_projects;
DROP TABLE IF EXISTS cesium_project_permissions;

-- Cesium ile ilgili storage bucket'ları sil
DELETE FROM storage.buckets WHERE id = 'cesium-files';
import os
import zipfile
import glob
import logging
import csv

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def zip_and_move(user_id: str) -> None:
	output_dir = "output"
	export_dir = "/exports"

	logger.debug("Creating export directory: %s", export_dir)
	os.makedirs(export_dir, exist_ok=True)

	zip_file_name = os.path.join(export_dir, f"{user_id}.zip")
	logger.debug("Creating ZIP file: %s", zip_file_name)
	try:
		with zipfile.ZipFile(zip_file_name, 'w') as zip_file:
			files = glob.glob(os.path.join(output_dir, f"{user_id}_*.csv"))
			logger.debug("Found CSV files to add to ZIP: %s", files)
			for file in files:
				if add_file_to_zip(zip_file, file) is not None:
					logger.error("Failed to add file to ZIP: %s", file)
					return

	except Exception as err:
		logger.error("Failed to create ZIP file: %s, error: %s", zip_file_name, err)
		return

	logger.info("ZIP file created successfully: %s", zip_file_name)

def add_file_to_zip(zip_file: zipfile.ZipFile, file_path: str) -> None:
	logger.debug("Opening file for ZIP: %s", file_path)
	try:
		with open(file_path, 'rb') as file:
			logger.debug("Copying file content to ZIP: %s", file_path)
			zip_file.write(file_path, os.path.basename(file_path))
			logger.debug("File added to ZIP: %s", file_path)
	except Exception as err:
		logger.error("Failed to open file: %s, error: %s", file_path, err)
		return err

def export_csv(user_id: str, user_data: dict) -> None:
	output_directory = "output"
	print("Creating output directory:", output_directory)

	try:
		os.makedirs(output_directory, exist_ok=True)
		print("Output directory created successfully:", output_directory)
	except Exception as error:
		print("Failed to create output directory:", output_directory, "error:", error)
		return error

	for table, data in user_data.items():
		file_path = os.path.join(output_directory, f"{user_id}_{table}.csv")
		print("Creating CSV file:", file_path)

		try:
			with open(file_path, mode='w', newline='') as file:
				writer = csv.writer(file)
				print("Writing records to CSV file:", file_path)

				for record in data:
					try:
						writer.writerow(record)
					except Exception as error:
						print("Failed to write record to CSV:", file_path, "record:", record, "error:", error)
						return error

				print("CSV exported successfully:", file_path)
		except Exception as error:
			print("Failed to create CSV file:", file_path, "error:", error)
			return error

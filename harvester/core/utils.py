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

	logger.debug(f"Creating export directory: {export_dir}")
	os.makedirs(export_dir, exist_ok=True)

	zip_file_name = os.path.join(export_dir, f"{user_id}.zip")
	logger.debug(f"Creating ZIP file: {zip_file_name}")
	try:
		with zipfile.ZipFile(zip_file_name, 'w') as zip_file:
			files = glob.glob(os.path.join(output_dir, f"{user_id}_*.csv"))
			for file in files:
				if add_file_to_zip(zip_file, file) is not None:
					logger.error(f"Failed to add file to ZIP: {file}")
					return

	except Exception as err:
		logger.error(f"Failed to create ZIP file: {zip_file_name}, error: {err}")
		return

	logger.info(f"ZIP file created successfully: {zip_file_name}")

def add_file_to_zip(zip_file: zipfile.ZipFile, file_path: str) -> None:
	logger.debug(f"Opening file for ZIP: {file_path}")
	try:
		with open(file_path, 'rb') as file:
			zip_file.write(file_path, os.path.basename(file_path))
	except Exception as err:
		logger.error(f"Failed to open file: {file_path}, error: {err}")
		return err

def export_csv(user_id: str, user_data: dict) -> None:
	output_directory = "output"
	logger.debug(f"Creating output directory: {output_directory}")

	try:
		os.makedirs(output_directory, exist_ok=True)
	except Exception as error:
		logger.error(f"Failed to create output directory: {output_directory}, error: {error}")
		return error

	for table, data in user_data.items():
		file_path = os.path.join(output_directory, f"{user_id}_{table}.csv")

		try:
			with open(file_path, mode='w', newline='') as file:
				writer = csv.writer(file)

				for record in data:
					try:
						writer.writerow(record)
					except Exception as error:
						logger.error(f"Failed to write record to CSV: {file_path}, record: {record}, error: {error}")
						return error

			logger.info(f"CSV exported successfully: {file_path}")
		except Exception as error:
			logger.error(f"Failed to create CSV file: {file_path}, error: {error}")
			return error

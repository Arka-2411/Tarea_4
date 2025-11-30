import pytest
import os
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from datetime import datetime

# --- CONFIGURACIÓN ---
@pytest.fixture(scope="module")
def driver():
    # Configura el navegador Chrome
    service = Service(ChromeDriverManager().install())
    options = webdriver.ChromeOptions()
    options.add_argument("--start-maximized")
    driver = webdriver.Chrome(service=service, options=options)
    
    # Carga tu archivo index.html local
    ruta_archivo = os.path.abspath("index.html")
    driver.get(f"file:///{ruta_archivo}")
    
    # Espera implícita para elementos
    driver.implicitly_wait(5)
    
    yield driver
    driver.quit()

# --- FUNCIÓN AUXILIAR PARA CAPTURAS (Requisito Tarea) ---
def tomar_captura(driver, nombre):
    if not os.path.exists("capturas"):
        os.makedirs("capturas")
    timestamp = datetime.now().strftime("%H-%M-%S")
    driver.save_screenshot(f"capturas/{nombre}_{timestamp}.png")

# --- PRUEBAS AUTOMATIZADAS ---

# 1. Prueba de Login Fallido (Caso Negativo)
def test_login_fallido(driver):
    driver.refresh()
    driver.find_element(By.ID, "username").send_keys("UsuarioFalso")
    driver.find_element(By.ID, "password").send_keys("ClaveMala")
    driver.find_element(By.ID, "btnLogin").click()
    
    time.sleep(1) # Espera breve para ver la acción
    tomar_captura(driver, "1_login_fallido")
    
    error_msg = driver.find_element(By.ID, "login-error").text
    assert "Acceso denegado" in error_msg

# 2. Prueba de Login Exitoso (
def test_login_exitoso(driver):
    driver.find_element(By.ID, "username").clear()
    driver.find_element(By.ID, "password").clear()
    
    driver.find_element(By.ID, "username").send_keys("Alfredo")
    driver.find_element(By.ID, "password").send_keys("20240050")
    tomar_captura(driver, "2_datos_correctos")
    
    driver.find_element(By.ID, "btnLogin").click()
    
    # Verificar que el dashboard es visible
    WebDriverWait(driver, 5).until(
        EC.visibility_of_element_located((By.ID, "dashboard-section"))
    )
    tomar_captura(driver, "3_ingreso_exitoso")
    assert driver.find_element(By.ID, "dashboard-section").is_displayed()

# 3. Prueba CRUD: Crear Producto
def test_crear_producto(driver):
    # Llenar formulario
    driver.find_element(By.ID, "nombreProducto").send_keys("Laptop Gamer")
    driver.find_element(By.ID, "precioProducto").send_keys("45000")
    
    # Seleccionar categoría (opcional, dejamos la default)
    tomar_captura(driver, "4_llenando_producto")
    
    # Guardar
    driver.find_element(By.ID, "btnGuardar").click()
    
    time.sleep(1) # Esperar refresco de tabla JS
    
    # Verificar en la tabla
    tabla_texto = driver.find_element(By.ID, "tabla-productos").text
    tomar_captura(driver, "5_producto_creado")
    
    assert "Laptop Gamer" in tabla_texto
    assert "45000" in tabla_texto

# 4. Prueba de Cierre de Sesión
def test_logout(driver):
    driver.find_element(By.ID, "btnLogout").click()
    time.sleep(1)
    tomar_captura(driver, "6_logout")
    
    # Verificar que volvimos al login
    assert driver.find_element(By.ID, "login-wrapper").is_displayed()
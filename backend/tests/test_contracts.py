"""Contratos HTTP usados por el frontend. Sin llamadas a Gemini ni Supabase."""
import os
from pathlib import Path
import unittest
from unittest.mock import patch

# Evitar que load_dotenv cargue claves personales durante las pruebas.
os.environ['GEMINI_API_KEY'] = ''
os.environ['SUPABASE_URL'] = ''
os.environ['SUPABASE_SERVICE_ROLE_KEY'] = ''

from app.main import app


class FrontendContracts(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()

    def test_health_without_external_credentials(self):
        response = self.client.get('/salud')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json['estado'], 'ok')
        self.assertFalse(response.json['gemini_configurado'])

    @patch('app.routes.guias.generar_guia')
    def test_guide_contract_and_invalid_input(self, generate):
        generate.return_value = {'titulo': 'Una clase', 'objetivo': 'Convivir'}
        response = self.client.post('/generar-guia', json={
            'tema': 'Convivencia', 'objetivo': 'Convivir', 'edad': 14, 'duracion': 30,
        })
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json['ok'])
        self.assertEqual(response.json['guia']['titulo'], 'Una clase')
        generate.assert_called_once_with('Convivencia', 'Convivir', 14, 30)
        generate.reset_mock()
        response = self.client.post('/generar-guia', json={
            'tema': 'Convivencia', 'objetivo': 'Convivir', 'edad': True, 'duracion': 30,
        })
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json)
        generate.assert_not_called()

    @patch('app.routes.reflexiones.analizar_reflexion')
    def test_reflection_contract(self, analyze):
        analyze.return_value = {'resumen': 'Escuchar otras perspectivas', 'indicadores': []}
        response = self.client.post('/analizar-reflexion', json={
            'actividad_id': 1, 'estudiante_id': 1, 'reflexion': 'Aprendí a escuchar.',
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn('analisis', response.json)
        self.assertEqual(response.json['analisis']['resumen'], 'Escuchar otras perspectivas')
        analyze.assert_called_once_with('Aprendí a escuchar.')

    @patch('app.routes.guias.generar_guia', side_effect=RuntimeError('Servicio no configurado'))
    def test_unavailable_ai_is_not_reported_as_success(self, generate):
        response = self.client.post('/generar-guia', json={
            'tema': 'Convivencia', 'objetivo': 'Convivir', 'edad': 14, 'duracion': 30,
        })
        self.assertEqual(response.status_code, 503)
        self.assertIn('error', response.json)
        self.assertNotIn('guia', response.json)

    def test_metrics_remain_explicitly_demo(self):
        response = self.client.get('/metricas')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json['demo'])
        self.assertIsInstance(response.json['indicadores'], list)
        self.assertIn('total_actividades', response.json)

    def test_example_environment_contains_no_secret_values(self):
        lines = Path('.env.example').read_text(encoding='utf-8-sig').splitlines()
        for line in lines:
            key, separator, value = line.partition('=')
            if separator and ('KEY' in key or 'SECRET' in key or 'PASSWORD' in key):
                self.assertFalse(value.strip(), f'{key} debe estar vacío en .env.example')


if __name__ == '__main__':
    unittest.main()

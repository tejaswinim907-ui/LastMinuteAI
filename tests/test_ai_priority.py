import unittest
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "backend"))

from app.ai import deadline_priority


class DeadlinePriorityTests(unittest.TestCase):
    def test_next_year_is_low_priority(self):
        self.assertEqual(deadline_priority("Submit report next year"), "Low")

    def test_next_month_is_low_priority(self):
        self.assertEqual(deadline_priority("Finish assignment next month"), "Low")


if __name__ == "__main__":
    unittest.main()

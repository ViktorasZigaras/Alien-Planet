from pathlib import Path

ROOT = Path(__file__).resolve().parent
parts = sorted((ROOT / "assets" / "roster-base64").glob("*.txt"))
if not parts:
    raise SystemExit("Starter art is missing.")
art = "data:image/png;base64," + "".join(p.read_text() for p in parts)
source = (ROOT / "src" / "game.html").read_text()
(ROOT / "index.html").write_text(source.replace("__STARTER_ART__", art))
print("Built index.html — open it in your browser.")

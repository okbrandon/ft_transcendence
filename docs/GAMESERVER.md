# GameServer

The Game server handles the scheduling of games for both same platform and cross platform (CLI vs Web) games.
Each new game spawn a new Goroutine, which runs on a dedicated thread (similar to fork in C).

:warning: Documentation is WIP
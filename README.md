# Steam On

Another Steam Minimalist Client

* NextJS
* Typescript
* Shadcn/ui

## Goals
- [ x ]  Homepage (hero banner)
- [ x ]  User Profile // Library
- [ x ] Recent Game Played // https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=KEY&steamid=STEAMid&format=json
- [ x ] Achievement User Page 
- [ x ] Game Page
- [ x ]  Game Page List // https://steamspy.com/api.php?request=all&page=1 https://store.steampowered.com/api/appdetails?appids=105600
- [ x ] Top List Games Page // https://steamspy.com/api.php?request=top100in2weeks
- [ ] Fix SEO title and description to sub pages
- [ ] Public User Page
- [ ] Minor css improvements and changes

## Steam Web API Use Cases

Site: https://developer.valvesoftware.com/wiki/Steam_Web_API

1. Obter notícias de um jogo específico: Use o método GetNewsForApp para obter as últimas notícias de um jogo especificado pelo seu ID de aplicativo.

2. Obter estatísticas de conquistas globais: Use o método GetGlobalAchievementPercentagesForApp para obter estatísticas de conquistas globais de um jogo específico.

3. Obter informações básicas de perfil de um usuário: Use o método GetPlayerSummaries para obter informações básicas de perfil de um usuário Steam.

4. Obter a lista de amigos de um usuário: Use o método GetFriendList para obter a lista de amigos de um usuário Steam, desde que o perfil do usuário esteja definido como "público".

5. Obter conquistas de jogos para um usuário: Use o método GetPlayerAchievements para obter uma lista de conquistas de jogos para um usuário específico.

6. Obter estatísticas de jogos para um usuário: Use o método GetUserStatsForGame para obter estatísticas de jogos para um usuário específico.

7. Obter uma lista de jogos que um usuário possui: Use o método GetOwnedGames para obter uma lista de jogos que um usuário possui, desde que o perfil do usuário esteja definido como "público".

8. Obter uma lista de jogos recentemente jogados por um usuário: Use o método GetRecentlyPlayedGames para obter uma lista de jogos recentemente jogados por um usuário, desde que o perfil do usuário esteja definido como "público".
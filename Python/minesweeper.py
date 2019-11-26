class Game:
  def __init__(self):
    self.grid = None
    self.status = "new"
    self.mineCount = None
    self.unvisitedCount = None
    self.hasFirstClick = False
    self.W = 25
    self.H = 10
    self.numMines = 50

  def startNewGame(self):
    self.status = "playing"
    self.hasFirstClick = False
    grid = [[]] * self.H
    for i in range(self.H):
      grid[i] = ["U"] * self.W
    self.grid = grid



game = Game()
game.startNewGame()
print(game.grid)
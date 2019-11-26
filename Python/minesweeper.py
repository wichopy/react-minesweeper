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
    self._generateBoard()

  # On every checkCell call, return new game state.
  def checkCell(self, row, col):
    if self.hasFirstClick == False:
      # populate board
      self._populateBoard()
    elif self.grid[row][col] == "M":
      self.status = "lose"
      self.grid[row][col] = "X"
      return

    numUpdates = self._updateBoard(row, col)
    self.unvisitedCount -= numUpdates
    if unvisitedCount == 0:
      self.status = "win"

  def _generateBoard(self):
    self.status = "playing"
    self.hasFirstClick = False
    grid = [[]] * self.H
    for i in range(self.H):
      grid[i] = ["U"] * self.W
    self.grid = grid

  def _populateBoard(self, protectedRow, protectedCol):

  def _updateBoard(self, row, col):


game = Game()
game.startNewGame()
print(game.grid)
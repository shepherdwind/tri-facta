# tri-FACTa!™ 领域驱动设计文档

## 1. 领域模型

### 1.1 核心领域模型

#### 1.1.1 卡牌 (Card)

```typescript
class Card {
  private value: number; // 卡牌数值
  private isWild: boolean; // 是否为万能牌
  private wildValue?: number; // 万能牌确定后的值

  constructor(value: number, isWild: boolean = false);

  // 设置万能牌的值，返回新的卡牌对象
  setWildValue(value: number): Card;

  // 获取卡牌的实际值
  getValue(): number;
}
```

#### 1.1.2 卡牌组 (CardGroup)

```typescript
class CardGroup {
  private workingArea: {
    topCard: Card | null;
    bottomLeftCard: Card | null;
    bottomRightCard: Card | null;
  };
  private committedState: {
    topCard: Card | null;
    bottomLeftCard: Card | null;
    bottomRightCard: Card | null;
    playerId: string | null;
  };

  constructor();

  // 验证是否可以放置卡牌
  canPlaceCards(cards: Map<'top' | 'bottomLeft' | 'bottomRight', Card>): boolean;

  // 放置卡牌（从暂存区）
  placeCards(cards: Map<'top' | 'bottomLeft' | 'bottomRight', Card>, playerId: string): void;

  // 提交卡牌组（等式成立时）
  commit(): void;

  // 获取指定位置的卡牌（优先返回工作区的卡牌，如果没有则返回提交区的卡牌）
  getCard(position: 'top' | 'bottomLeft' | 'bottomRight'): Card | null;

  // 检查卡牌组是否完整
  isComplete(): boolean;

  // 验证卡牌组是否正确
  validate(mode: GameMode): boolean;

  // 获取当前放置卡牌的玩家ID
  getPlayerId(): string | null;
}
```

#### 1.1.3 玩家 (Player)

```typescript
class Player {
  private id: string; // 玩家ID
  private name: string; // 玩家名称
  private hand: Card[]; // 手牌
  private isCurrentTurn: boolean; // 是否当前回合
  private stagingArea: Map<'top' | 'bottomLeft' | 'bottomRight', Card>; // 暂存区

  constructor(id: string, name: string);

  // 添加卡牌到玩家手牌
  addCard(card: Card): void;

  // 从手牌中取出卡牌到暂存区
  stageCard(card: Card, position: 'top' | 'bottomLeft' | 'bottomRight'): void;

  // 从暂存区移除卡牌
  unstageCard(position: 'top' | 'bottomLeft' | 'bottomRight'): void;

  // 清空暂存区
  clearStagingArea(): void;

  // 获取暂存区的卡牌
  getStagedCards(): Map<'top' | 'bottomLeft' | 'bottomRight', Card>;

  // 检查玩家是否有指定的卡牌
  hasCards(cards: Card[]): boolean;

  // 获取玩家手牌
  getHand(): Card[];

  // 设置是否为当前回合
  setCurrentTurn(isCurrent: boolean): void;

  // 检查是否获胜（手牌为空）
  hasWon(): boolean;
}
```

#### 1.1.4 游戏 (Game)

```typescript
class Game {
  private mode: GameMode; // 游戏模式
  private players: Player[]; // 玩家列表
  private deck: Deck; // 牌组
  private currentPlayer: Player; // 当前玩家
  private cardGroup: CardGroup; // 游戏卡牌组（所有玩家共用）
  private state: GameState; // 游戏状态
  private isFirstTurn: boolean; // 是否为第一回合

  constructor(mode: GameMode, players: Player[]);

  // 开始游戏（分发初始手牌）
  start(): void;

  // 玩家抽一张牌
  drawCard(playerId: string): Card;

  // 玩家出牌（使用暂存区的卡牌）
  playCards(playerId: string): void;

  // 结束当前回合
  endTurn(): void;

  // 跳过当前回合（抽牌后仍无法出牌）
  skip(playerId: string): void;

  // 检查游戏是否结束
  isFinished(): boolean;

  // 获取获胜者
  getWinner(): Player | null;
}
```

#### 1.1.5 牌组 (Deck)

```typescript
class Deck {
  private cards: Card[]; // 牌组中的卡牌

  constructor();

  // 初始化牌组（创建所有卡牌）
  initialize(): void;

  // 洗牌
  shuffle(): void;

  // 抽牌
  draw(count: number): Card[];

  // 检查牌组是否为空
  isEmpty(): boolean;
}
```

### 1.2 值对象

#### 1.2.1 游戏模式 (GameMode)

```typescript
enum GameMode {
  ADDITION = 'ADDITION', // 加减法模式
  MULTIPLICATION = 'MULTIPLICATION', // 乘除法模式
}
```

#### 1.2.2 游戏状态 (GameState)

```typescript
enum GameState {
  INIT = 'INIT',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  FINISHED = 'FINISHED',
}
```

## 2. 领域服务

### 2.1 游戏规则服务 (GameRuleService)

```typescript
class GameRuleService {
  // 验证卡牌组
  validateCardGroup(cards: Card[], mode: GameMode): boolean;

  // 计算结果
  calculateResult(cards: Card[], mode: GameMode): number;

  // 验证出牌是否有效
  isValidPlay(lastPlay: CardGroup, currentPlay: CardGroup): boolean;
}
```

### 2.2 游戏管理服务 (GameManagementService)

```typescript
class GameManagementService {
  // 创建新游戏
  createGame(mode: GameMode, players: Player[]): Game;

  // 开始游戏
  startGame(gameId: string): void;

  // 结束游戏
  endGame(gameId: string): void;

  // 保存游戏
  saveGame(gameId: string): void;

  // 加载游戏
  loadGame(gameId: string): Game;
}
```

## 3. 用例

### 3.1 游戏初始化用例

1. 创建新游戏

   - 输入：游戏模式、玩家信息
   - 输出：新创建的游戏实例
   - 前置条件：玩家数量为2
   - 后置条件：游戏状态为INIT

2. 开始游戏
   - 输入：游戏ID
   - 输出：更新后的游戏状态
   - 前置条件：游戏状态为INIT
   - 后置条件：游戏状态为PLAYING，初始手牌已分发

### 3.2 游戏进行用例

1. 玩家出牌

   - 输入：玩家ID、要出的卡牌
   - 输出：出牌结果
   - 前置条件：游戏状态为PLAYING，轮到该玩家
   - 后置条件：卡牌组有效，更新游戏状态

2. 结束回合
   - 输入：玩家ID
   - 输出：更新后的游戏状态
   - 前置条件：玩家已经出牌或无法出牌
   - 后置条件：切换到下一个玩家

### 3.3 游戏结束用例

1. 检查胜利条件

   - 输入：游戏ID
   - 输出：胜利状态
   - 前置条件：游戏状态为PLAYING
   - 后置条件：如果满足胜利条件，游戏状态更新为FINISHED

2. 保存游戏
   - 输入：游戏ID
   - 输出：保存结果
   - 前置条件：游戏状态为PLAYING或PAUSED
   - 后置条件：游戏状态被保存到本地存储

## 4. 领域事件

### 4.1 游戏事件

- GameStarted
- CardPlayed
- TurnEnded
- GameFinished
- GamePaused
- GameResumed

### 4.2 玩家事件

- CardsDrawn
- CardsReplaced
- InvalidPlayAttempted
- WildCardUsed

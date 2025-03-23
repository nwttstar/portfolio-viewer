# 要件定義

## 1. システム概要
システム名称: Portfolio Viewer
フロントエンドのみで動作する画像ビューワー。  
ユーザーが用意した画像を読み込み、表示/簡単な編集を行うことができるアプリケーション。  

## 2. システムの目的
ポートフォリオとして制作者の技術情報を伝える。

## 3. 機能要件
### 画像のインスペクタの表示
読み込んだ画像の基本情報（解像度、ファイルサイズ、フォーマットなど）を表示する。

### ドラッグ＆ドロップで画像の読み込み
Finder等から直接画像をドラッグ＆ドロップで読み込む。

### スクロール操作による拡大/縮小
マウスホイールやタッチパッドでのスクロール操作により、画像をズームイン・ズームアウトする。

### パンによる移動
画像をクリック＆ドラッグすることで、表示領域内を移動できる。

### テキストツール
画像上にテキストを入力し、フォント・サイズ・色の調整など基本的なテキスト編集が可能。

### ペンツール
自由描画ができるペンツールを提供し、線の太さ・色の設定が可能。

### 矩形、円形ツール
図形描画ツールにより、矩形や円形を描画し、境界線や塗りつぶしのスタイルを調整できる。

### 画像の回転
画像を90度/180度/270度の角度で回転させる。

### 画像のトリミング
ユーザーが指定した領域で画像を切り抜くトリミング機能。

### undo/redo
編集操作の履歴管理を行い、元に戻す・やり直す機能を実装する。

### 編集した画像のダウンロード
編集内容を反映した画像を、ユーザーがローカルにダウンロードできる機能を提供。

## 4. 非機能要件
### パフォーマンス
高解像度画像でもスムーズに操作できること。

### ユーザビリティ
シンプルで直感的なUI設計を目指す。各ツールの操作方法を明示し、初めてのユーザでも扱いやすい設計とする。

### ブラウザ互換性
最新の主要ブラウザ（Chrome, Firefox, Safari, Edge等）で正常動作すること。

## 5. 技術要件
### 使用技術
#### 言語: TypeScript
#### ライブラリ/フレームワーク: React, Tailwind CSS
#### ビルドツール: Vite

### 実行環境
クライアントサイドのみで動作。バックエンドは不要。

--- 

# 基本設計

## 1. システムアーキテクチャ
Portfolio ViewerはSPA（Single Page Application）として構築する。

### 構成
#### 基本構成: React + TypeScript
#### 状態管理: Redux
#### ビルド: Vite
#### CSS設計: Tailwind CSS
#### テスト: vitest　+ Playwright

## 2. コンポーネント設計（Atomicデザイン）
Atomicデザインの原則に基づいてコンポーネントを構成する。

### Atoms
ビジネスロジックを含まない、単純なボタン、入力フィールド、ラベル、アイコンなどの最小単位のUI要素。
### Molecules
ツールバー、画像インスペクタ、キャンバス操作用ボタンなど、Atomsの組み合わせで構成される小規模なUIパーツ。
基本的なビジネスロジックを含むが、複雑なものは含まない。
### Organisms
画像エディタ領域、ツールパネルなど、複数のMolecules/Atomsで構成される主要なUIセクション。
ドメイン固有のビジネスロジックを含み(例: 画像編集操作、キャンバス操作、編集履歴の管理など)、Reduxとの連携を行う。
### Templates
ページ全体のレイアウトを定義し、それに専念する。ロジックを含まない。
#### このアプリケーションはSPAとして設計されているため、Pagesレベルのコンポーネントは必要としない。

## 3. 主な機能の実装概要
機能の内容については「要件定義」を参照。

### 画像の読み込みと表示
HTML5 File APIを用いて画像データを取得、Blobに変換後、react-konvaのImageコンポーネントで描画。

### 画像の編集機能
#### 拡大/縮小
マウスホイールやタッチパッドの操作でreact-konvaのスケールプロパティを変更して実装。
#### パン
クリック＆ドラッグ操作でreact-konva上の画像位置を移動。
#### 回転
90°/180°/270°の固定角度での回転操作を実装。
#### トリミング
ユーザーが指定した領域を選択し、react-konva上でトリミング操作を実施。トリミングの取り消しも可能。
#### テキストツール
react-konvaのTextコンポーネントを用い、フォント、サイズ、色の変更など基本的な編集機能を提供。
#### ペンツール
react-konva上で自由描画。線の太さや色の調整を可能にする。
#### 矩形、円形ツール
react-konvaのShape機能を用い、矩形や円形を描画。領域内の塗りつぶしを可能にする。

### Undo/Redo 機能
Reduxのstate管理により、各編集操作をアクションとして記録。履歴スタックを操作して状態の復元を行う

### 編集画像のダウンロード
react-konvaのキャンバスの最終状態を取得し、Blobに変換後、ダウンロードリンクを生成して提供。

## 4. 状態管理
- 現在読み込まれている画像のデータ（Blob URL等）および画像メタデータ（解像度、ファイルサイズ、フォーマットなど）
- 編集操作の履歴。undo/redo用に各操作（描画、トリミング、回転など）を記録するスタック構造
- 現在選択中のツール（テキスト、ペンなど）
- 選択中のツールに紐づくオプション設定(テキストであればサイズ・色など)
- キャンバスに関する状態（現在のズーム倍率、パン位置、トリミング領域、回転角度など）
- Canvas上に描画された要素の一覧（テキスト、ペンなど）

## 5. テスト戦略
### unitテスト
vitestを用いて各コンポーネントやユーティリティ関数の単体テストを実装。

### e2eテスト
Playwrightを利用して、編集機能の動作確認を行う。
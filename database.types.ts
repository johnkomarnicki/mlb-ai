export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      environment: {
        Row: {
          createdAt: string | null
          gameId: number | null
          id: string
          isIndoorStadium: boolean | null
          temperature: number | null
          weatherCondition: string | null
          windDirection: string | null
          windSpeed: number | null
        }
        Insert: {
          createdAt?: string | null
          gameId?: number | null
          id?: string
          isIndoorStadium?: boolean | null
          temperature?: number | null
          weatherCondition?: string | null
          windDirection?: string | null
          windSpeed?: number | null
        }
        Update: {
          createdAt?: string | null
          gameId?: number | null
          id?: string
          isIndoorStadium?: boolean | null
          temperature?: number | null
          weatherCondition?: string | null
          windDirection?: string | null
          windSpeed?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "environment_gameId_fkey"
            columns: ["gameId"]
            isOneToOne: true
            referencedRelation: "games"
            referencedColumns: ["gameId"]
          },
        ]
      }
      gamePredictions: {
        Row: {
          awayTeamId: number
          awayTeamName: string | null
          createdAt: string | null
          gameDate: string
          gameId: number
          grade: string | null
          homeTeamId: number
          homeTeamName: string | null
          id: string
          predictedAwayScore: number | null
          predictedHomeScore: number | null
          predictedTotalScore: number | null
          summary: string | null
          teamEdgeId: number | null
          teamEdgeName: string | null
          vegasOdds: number | null
        }
        Insert: {
          awayTeamId: number
          awayTeamName?: string | null
          createdAt?: string | null
          gameDate: string
          gameId: number
          grade?: string | null
          homeTeamId: number
          homeTeamName?: string | null
          id?: string
          predictedAwayScore?: number | null
          predictedHomeScore?: number | null
          predictedTotalScore?: number | null
          summary?: string | null
          teamEdgeId?: number | null
          teamEdgeName?: string | null
          vegasOdds?: number | null
        }
        Update: {
          awayTeamId?: number
          awayTeamName?: string | null
          createdAt?: string | null
          gameDate?: string
          gameId?: number
          grade?: string | null
          homeTeamId?: number
          homeTeamName?: string | null
          id?: string
          predictedAwayScore?: number | null
          predictedHomeScore?: number | null
          predictedTotalScore?: number | null
          summary?: string | null
          teamEdgeId?: number | null
          teamEdgeName?: string | null
          vegasOdds?: number | null
        }
        Relationships: []
      }
      gamePredictionsBeta: {
        Row: {
          awayTeamId: number
          awayTeamName: string | null
          createdAt: string | null
          gameDate: string
          gameId: number
          grade: string | null
          homeTeamId: number
          homeTeamName: string | null
          id: string
          predictedAwayScore: number | null
          predictedHomeScore: number | null
          predictedTotalScore: number | null
          summary: string | null
          teamEdgeId: number | null
          teamEdgeName: string | null
          vegasOdds: number | null
        }
        Insert: {
          awayTeamId: number
          awayTeamName?: string | null
          createdAt?: string | null
          gameDate: string
          gameId: number
          grade?: string | null
          homeTeamId: number
          homeTeamName?: string | null
          id?: string
          predictedAwayScore?: number | null
          predictedHomeScore?: number | null
          predictedTotalScore?: number | null
          summary?: string | null
          teamEdgeId?: number | null
          teamEdgeName?: string | null
          vegasOdds?: number | null
        }
        Update: {
          awayTeamId?: number
          awayTeamName?: string | null
          createdAt?: string | null
          gameDate?: string
          gameId?: number
          grade?: string | null
          homeTeamId?: number
          homeTeamName?: string | null
          id?: string
          predictedAwayScore?: number | null
          predictedHomeScore?: number | null
          predictedTotalScore?: number | null
          summary?: string | null
          teamEdgeId?: number | null
          teamEdgeName?: string | null
          vegasOdds?: number | null
        }
        Relationships: []
      }
      games: {
        Row: {
          awayId: number | null
          awayScore: number | null
          awayTeam: string | null
          createdAt: string | null
          finalScore: number | null
          gameDate: string | null
          gameId: number | null
          homeId: number | null
          homeScore: number | null
          homeTeam: string | null
          homeWin: boolean | null
          id: string
        }
        Insert: {
          awayId?: number | null
          awayScore?: number | null
          awayTeam?: string | null
          createdAt?: string | null
          finalScore?: number | null
          gameDate?: string | null
          gameId?: number | null
          homeId?: number | null
          homeScore?: number | null
          homeTeam?: string | null
          homeWin?: boolean | null
          id?: string
        }
        Update: {
          awayId?: number | null
          awayScore?: number | null
          awayTeam?: string | null
          createdAt?: string | null
          finalScore?: number | null
          gameDate?: string | null
          gameId?: number | null
          homeId?: number | null
          homeScore?: number | null
          homeTeam?: string | null
          homeWin?: boolean | null
          id?: string
        }
        Relationships: []
      }
      pitcherStats: {
        Row: {
          bb9: number | null
          createdAt: string | null
          era: number | null
          gameDate: string | null
          gameId: number
          hr9: number | null
          id: string
          inningsPitched: number | null
          isStarter: boolean | null
          losses: number | null
          pitcherId: number | null
          pitcherName: string | null
          so9: number | null
          team: string | null
          teamId: number
          teamName: string | null
          whip: number | null
          wins: number | null
        }
        Insert: {
          bb9?: number | null
          createdAt?: string | null
          era?: number | null
          gameDate?: string | null
          gameId: number
          hr9?: number | null
          id?: string
          inningsPitched?: number | null
          isStarter?: boolean | null
          losses?: number | null
          pitcherId?: number | null
          pitcherName?: string | null
          so9?: number | null
          team?: string | null
          teamId: number
          teamName?: string | null
          whip?: number | null
          wins?: number | null
        }
        Update: {
          bb9?: number | null
          createdAt?: string | null
          era?: number | null
          gameDate?: string | null
          gameId?: number
          hr9?: number | null
          id?: string
          inningsPitched?: number | null
          isStarter?: boolean | null
          losses?: number | null
          pitcherId?: number | null
          pitcherName?: string | null
          so9?: number | null
          team?: string | null
          teamId?: number
          teamName?: string | null
          whip?: number | null
          wins?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pitcherStats_gameId_fkey"
            columns: ["gameId"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["gameId"]
          },
        ]
      }
      recentTeamPerformance: {
        Row: {
          battingAvg: number | null
          bullpenEra: number | null
          bullpenInningsPitched: number | null
          bullpenSo9: number | null
          bullpenWhip: number | null
          createdAt: string | null
          defEfficiency: number | null
          errorsPerGame: number | null
          hitsPerGame: number | null
          homeRunsPerGame: number | null
          id: string
          inningsPitched: number | null
          leftOnBase: number | null
          obp: number | null
          ops: number | null
          pitcherBb9: number | null
          pitcherEra: number | null
          pitcherHr9: number | null
          pitcherSo9: number | null
          pitcherWhip: number | null
          rbiPerGame: number | null
          runsPerGame: number | null
          slg: number | null
          strikeoutsPerGame: number | null
          teamId: number
          teamName: string | null
          walksPerGame: number | null
        }
        Insert: {
          battingAvg?: number | null
          bullpenEra?: number | null
          bullpenInningsPitched?: number | null
          bullpenSo9?: number | null
          bullpenWhip?: number | null
          createdAt?: string | null
          defEfficiency?: number | null
          errorsPerGame?: number | null
          hitsPerGame?: number | null
          homeRunsPerGame?: number | null
          id?: string
          inningsPitched?: number | null
          leftOnBase?: number | null
          obp?: number | null
          ops?: number | null
          pitcherBb9?: number | null
          pitcherEra?: number | null
          pitcherHr9?: number | null
          pitcherSo9?: number | null
          pitcherWhip?: number | null
          rbiPerGame?: number | null
          runsPerGame?: number | null
          slg?: number | null
          strikeoutsPerGame?: number | null
          teamId: number
          teamName?: string | null
          walksPerGame?: number | null
        }
        Update: {
          battingAvg?: number | null
          bullpenEra?: number | null
          bullpenInningsPitched?: number | null
          bullpenSo9?: number | null
          bullpenWhip?: number | null
          createdAt?: string | null
          defEfficiency?: number | null
          errorsPerGame?: number | null
          hitsPerGame?: number | null
          homeRunsPerGame?: number | null
          id?: string
          inningsPitched?: number | null
          leftOnBase?: number | null
          obp?: number | null
          ops?: number | null
          pitcherBb9?: number | null
          pitcherEra?: number | null
          pitcherHr9?: number | null
          pitcherSo9?: number | null
          pitcherWhip?: number | null
          rbiPerGame?: number | null
          runsPerGame?: number | null
          slg?: number | null
          strikeoutsPerGame?: number | null
          teamId?: number
          teamName?: string | null
          walksPerGame?: number | null
        }
        Relationships: []
      }
      teamStats: {
        Row: {
          battingAvg: number | null
          bullpenEra: number | null
          bullpenInningsPitched: number | null
          bullpenSo9: number | null
          bullpenWhip: number | null
          createdAt: string | null
          defEfficiency: number | null
          errorsPerGame: number | null
          gameDate: string | null
          gameId: number | null
          hitsPerGame: number | null
          homeRunsPerGame: number | null
          id: string
          isHome: boolean | null
          leftOnBase: number | null
          obp: number | null
          ops: number | null
          rbiPerGame: number | null
          runsPerGame: number | null
          slg: number | null
          strikeoutsPerGame: number | null
          teamId: number | null
          teamName: string | null
          walksPerGame: number | null
        }
        Insert: {
          battingAvg?: number | null
          bullpenEra?: number | null
          bullpenInningsPitched?: number | null
          bullpenSo9?: number | null
          bullpenWhip?: number | null
          createdAt?: string | null
          defEfficiency?: number | null
          errorsPerGame?: number | null
          gameDate?: string | null
          gameId?: number | null
          hitsPerGame?: number | null
          homeRunsPerGame?: number | null
          id?: string
          isHome?: boolean | null
          leftOnBase?: number | null
          obp?: number | null
          ops?: number | null
          rbiPerGame?: number | null
          runsPerGame?: number | null
          slg?: number | null
          strikeoutsPerGame?: number | null
          teamId?: number | null
          teamName?: string | null
          walksPerGame?: number | null
        }
        Update: {
          battingAvg?: number | null
          bullpenEra?: number | null
          bullpenInningsPitched?: number | null
          bullpenSo9?: number | null
          bullpenWhip?: number | null
          createdAt?: string | null
          defEfficiency?: number | null
          errorsPerGame?: number | null
          gameDate?: string | null
          gameId?: number | null
          hitsPerGame?: number | null
          homeRunsPerGame?: number | null
          id?: string
          isHome?: boolean | null
          leftOnBase?: number | null
          obp?: number | null
          ops?: number | null
          rbiPerGame?: number | null
          runsPerGame?: number | null
          slg?: number | null
          strikeoutsPerGame?: number | null
          teamId?: number | null
          teamName?: string | null
          walksPerGame?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "teamStats_gameId_fkey"
            columns: ["gameId"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["gameId"]
          },
        ]
      }
      todaysGames: {
        Row: {
          awayPitcherId: number | null
          awayPitcherName: string | null
          awayStarterBb9: number | null
          awayStarterEra: number | null
          awayStarterHr9: number | null
          awayStarterInningsPitched: number | null
          awayStarterSo9: number | null
          awayStarterWhip: number | null
          awayTeamId: number
          awayTeamName: string | null
          createdAt: string | null
          gameDate: string
          gameId: number
          homePitcherId: number | null
          homePitcherName: string | null
          homeStarterBb9: number | null
          homeStarterEra: number | null
          homeStarterHr9: number | null
          homeStarterInningsPitched: number | null
          homeStarterSo9: number | null
          homeStarterWhip: number | null
          homeTeamId: number
          homeTeamName: string | null
        }
        Insert: {
          awayPitcherId?: number | null
          awayPitcherName?: string | null
          awayStarterBb9?: number | null
          awayStarterEra?: number | null
          awayStarterHr9?: number | null
          awayStarterInningsPitched?: number | null
          awayStarterSo9?: number | null
          awayStarterWhip?: number | null
          awayTeamId: number
          awayTeamName?: string | null
          createdAt?: string | null
          gameDate: string
          gameId: number
          homePitcherId?: number | null
          homePitcherName?: string | null
          homeStarterBb9?: number | null
          homeStarterEra?: number | null
          homeStarterHr9?: number | null
          homeStarterInningsPitched?: number | null
          homeStarterSo9?: number | null
          homeStarterWhip?: number | null
          homeTeamId: number
          homeTeamName?: string | null
        }
        Update: {
          awayPitcherId?: number | null
          awayPitcherName?: string | null
          awayStarterBb9?: number | null
          awayStarterEra?: number | null
          awayStarterHr9?: number | null
          awayStarterInningsPitched?: number | null
          awayStarterSo9?: number | null
          awayStarterWhip?: number | null
          awayTeamId?: number
          awayTeamName?: string | null
          createdAt?: string | null
          gameDate?: string
          gameId?: number
          homePitcherId?: number | null
          homePitcherName?: string | null
          homeStarterBb9?: number | null
          homeStarterEra?: number | null
          homeStarterHr9?: number | null
          homeStarterInningsPitched?: number | null
          homeStarterSo9?: number | null
          homeStarterWhip?: number | null
          homeTeamId?: number
          homeTeamName?: string | null
        }
        Relationships: []
      }
      vegasLines: {
        Row: {
          awayMoneyline: number | null
          closingLineMovement: string | null
          createdAt: string | null
          gameId: number | null
          homeMoneyline: number | null
          id: string
          overUnder: number | null
          runLineAway: number | null
          runLineHome: number | null
        }
        Insert: {
          awayMoneyline?: number | null
          closingLineMovement?: string | null
          createdAt?: string | null
          gameId?: number | null
          homeMoneyline?: number | null
          id?: string
          overUnder?: number | null
          runLineAway?: number | null
          runLineHome?: number | null
        }
        Update: {
          awayMoneyline?: number | null
          closingLineMovement?: string | null
          createdAt?: string | null
          gameId?: number | null
          homeMoneyline?: number | null
          id?: string
          overUnder?: number | null
          runLineAway?: number | null
          runLineHome?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vegasLines_gameId_fkey"
            columns: ["gameId"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["gameId"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

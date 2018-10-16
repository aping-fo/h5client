using Com.Game.ConfigData;
using Protocol;
using CodeStage.AntiCheat.ObscuredTypes;
using ByteBuilder;

namespace Com.Game.ConfigData
{
	//(工具自动生成，请勿手动修改！）
	[System.Serializable]
	public class SerializeHelper
	{

		
		public static LevelCfg[] GetLevelCfg1(BufferBuilder bb)
		{
			if(bb.GetNullFlag())
			{
				return null;
			}
			else
			{
				int length = bb.Get7BitEncodeInt();
				LevelCfg[] value = new LevelCfg[length];
				for(int i=0;i<length;i++)
				{
					value[i] = SerializeHelper.GetLevelCfg(bb);
				}
				return value;
			}
		}

		
		public static void PutLevelCfg1(BufferBuilder bb,LevelCfg[] value)
		{
			if(!bb.PutNullFlag(value))
			{
				int length = value.Length;
				bb.Put7BitEncodeInt(length);
				for(int i=0;i<length;i++)
				{
					SerializeHelper.PutLevelCfg(bb,value[i]);
				}
			}
		}

		
        public static LevelCfg GetLevelCfg(BufferBuilder bb)
        {
            if(bb.GetNullFlag())
                return null;
            else 
            {
                LevelCfg value = new LevelCfg();
                value.Decode(bb);
                return value;
            }
        }

		
        public static void PutLevelCfg(BufferBuilder bb,LevelCfg value) 
        {
            if(!bb.PutNullFlag(value))
                value.Encode(bb);
        }

		
		public static QuestionCfg[] GetQuestionCfg1(BufferBuilder bb)
		{
			if(bb.GetNullFlag())
			{
				return null;
			}
			else
			{
				int length = bb.Get7BitEncodeInt();
				QuestionCfg[] value = new QuestionCfg[length];
				for(int i=0;i<length;i++)
				{
					value[i] = SerializeHelper.GetQuestionCfg(bb);
				}
				return value;
			}
		}

		
		public static void PutQuestionCfg1(BufferBuilder bb,QuestionCfg[] value)
		{
			if(!bb.PutNullFlag(value))
			{
				int length = value.Length;
				bb.Put7BitEncodeInt(length);
				for(int i=0;i<length;i++)
				{
					SerializeHelper.PutQuestionCfg(bb,value[i]);
				}
			}
		}

		
        public static QuestionCfg GetQuestionCfg(BufferBuilder bb)
        {
            if(bb.GetNullFlag())
                return null;
            else 
            {
                QuestionCfg value = new QuestionCfg();
                value.Decode(bb);
                return value;
            }
        }

		
        public static void PutQuestionCfg(BufferBuilder bb,QuestionCfg value) 
        {
            if(!bb.PutNullFlag(value))
                value.Encode(bb);
        }

		
		public static string[] GetString1(BufferBuilder bb)
		{
			if(bb.GetNullFlag())
			{
				return null;
			}
			else
			{
				int length = bb.Get7BitEncodeInt();
				string[] value = new string[length];
				for(int i=0;i<length;i++)
				{
					value[i] = bb.GetString();
				}
				return value;
			}
		}

		
		public static void PutString1(BufferBuilder bb,string[] value)
		{
			if(!bb.PutNullFlag(value))
			{
				int length = value.Length;
				bb.Put7BitEncodeInt(length);
				for(int i=0;i<length;i++)
				{
					bb.PutString(value[i]);
				}
			}
		}


	}
}
